'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import IndicationManager from './IndicationManager';

interface HierarchySymptom {
  id: number;
  title: string;
  slug: string;
  variants: {
    id: number;
    name: string;
    slug: string;
  }[];
}

interface IndicationData {
  herbs: Array<{ id: number; name: string; slug: string }>;
  supplements: Array<{ id: number; name: string; slug: string }>;
}

interface InteractiveTreeDiagramProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TreeNode {
  id: number;
  title: string;
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
  variants: TreeNodeVariant[];
  isExpanded: boolean;
}

interface TreeNodeVariant {
  id: number;
  name: string;
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function InteractiveTreeDiagram({ isOpen, onClose }: InteractiveTreeDiagramProps) {
  const [hierarchyData, setHierarchyData] = useState<HierarchySymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [clickedNode, setClickedNode] = useState<{ type: 'symptom' | 'variant'; id: number; x: number; y: number } | null>(null);
  const [indicationData, setIndicationData] = useState<Record<number, IndicationData>>({});
  const [showIndicationManager, setShowIndicationManager] = useState(false);
  const [indicationManagerData, setIndicationManagerData] = useState<{
    symptomId?: number;
    variantId?: number;
    symptomTitle?: string;
    variantName?: string;
  }>({});
  const [herbTooltip, setHerbTooltip] = useState<{ herb: any; x: number; y: number } | null>(null);
  const [supplementTooltip, setSupplementTooltip] = useState<{ supplement: any; x: number; y: number } | null>(null);
  
  // Debug logging for tooltip state changes
  useEffect(() => {
    console.log('Herb tooltip state changed:', herbTooltip);
  }, [herbTooltip]);
  
  useEffect(() => {
    console.log('Supplement tooltip state changed:', supplementTooltip);
  }, [supplementTooltip]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      fetchHierarchyData();
    }
  }, [isOpen]);

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on a tooltip element
      const isTooltipClick = target.closest('[data-tooltip="true"]');
      
      // Don't close if clicking on a tooltip button
      const isTooltipButtonClick = target.closest('[data-tooltip-button="true"]');
      
      if (!isTooltipClick && !isTooltipButtonClick && (herbTooltip || supplementTooltip)) {
        // Use requestAnimationFrame to ensure this runs after the current event loop
        requestAnimationFrame(() => {
          console.log('Closing tooltip - clicked outside');
          setHerbTooltip(null);
          setSupplementTooltip(null);
        });
      }
    };

    // Use a longer delay to ensure the event has fully processed
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [herbTooltip, supplementTooltip]);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/symptoms/hierarchy');
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
          setHierarchyData(result.data);
        } else if (Array.isArray(result)) {
          setHierarchyData(result);
        } else {
          setHierarchyData([]);
        }
      } else {
        setHierarchyData([]);
      }
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      setHierarchyData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndicationData = async (id: number) => {
    try {
      // Check if this ID is a symptom or variant
      const isSymptom = hierarchyData.some(s => s.id === id);
      const isVariant = treeNodes.some(n => n.variants.some(v => v.id === id));
      
      console.log(`Fetching indications for ID ${id}:`, { isSymptom, isVariant });
      
      if (!isSymptom && !isVariant) {
        console.warn('ID not found in hierarchy data:', id);
        return;
      }

      let targetId = id;
      let targetType = 'symptom';
      
      if (isVariant) {
        // For variants, use the variant ID directly to get variant-specific indications
        targetId = id;
        targetType = 'variant';
      } else if (isSymptom) {
        // For symptoms, we want empty herbs (symptoms don't have direct indications)
        targetType = 'symptom';
      }

      console.log(`API call: /api/symptoms/${targetId}/indications?targetType=${targetType}`);
      
      const response = await fetch(`/api/symptoms/${targetId}/indications?targetType=${targetType}`);
      if (response.ok) {
        const result = await response.json();
        console.log(`API response for ${id}:`, result);
        if (result.success && result.data) {
          // Store the data with the original clicked ID (could be symptom or variant)
          setIndicationData(prev => ({
            ...prev,
            [id]: result.data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching indication data:', error);
    }
  };

  // Calculate tree layout
  const calculateTreeLayout = (): { nodes: TreeNode[], totalHeight: number } => {
    if (!hierarchyData.length) return { nodes: [], totalHeight: 0 };

    const nodes: TreeNode[] = [];
    const nodeWidth = 180;
    const nodeHeight = 70;
    const variantHeight = 45;
    const horizontalSpacing = 40; // Reduced space between symptoms and variants
    const variantVerticalSpacing = 60; // Increased spacing between variants to prevent overlap
    const groupSpacing = 40; // Minimum spacing between symptom groups

    let currentY = pan.y + 20; // Start position

    hierarchyData.forEach((symptom, index) => {
      const x = pan.x + 400; // Move tree 33% to the right
      
      // Calculate how much vertical space this symptom group needs
      const variantsHeight = symptom.variants.length > 0 
        ? (symptom.variants.length - 1) * variantVerticalSpacing + variantHeight
        : 0;
      const totalGroupHeight = Math.max(nodeHeight, variantsHeight);
      
      const variants: TreeNodeVariant[] = symptom.variants.map((variant, vIndex) => ({
        ...variant,
        x: x + nodeWidth + horizontalSpacing, // Position variants closer to symptoms
        y: currentY + (vIndex * variantVerticalSpacing), // Stack variants vertically under their symptom
        width: nodeWidth - 20,
        height: variantHeight - 5
      }));

      nodes.push({
        ...symptom,
        x,
        y: currentY,
        width: nodeWidth,
        height: nodeHeight,
        variants,
        isExpanded: true
      });

      // Move to next position: current group height + spacing
      currentY += totalGroupHeight + groupSpacing;
    });

    return { nodes, totalHeight: currentY };
  };

  const treeLayout = calculateTreeLayout();
  const treeNodes = treeLayout.nodes;
  const totalTreeHeight = treeLayout.totalHeight;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Don't prevent default - let the natural scrolling happen
    // Only zoom if Ctrl key is held down
    if (e.ctrlKey) {
      e.preventDefault();
      const newZoom = Math.max(0.5, Math.min(2, zoom - e.deltaY * 0.001));
      setZoom(newZoom);
    }
  };

  const toggleNodeExpansion = (nodeId: number) => {
    // In a real implementation, you'd update the node's isExpanded state
    // For now, we'll just toggle the selected node
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleOpenIndicationManager = () => {
    if (!clickedNode) return;
    
    const symptom = hierarchyData.find(s => s.id === clickedNode.id);
    const variant = treeNodes.find(n => n.variants.some(v => v.id === clickedNode.id))?.variants.find(v => v.id === clickedNode.id);
    
    setIndicationManagerData({
      symptomId: clickedNode.type === 'symptom' ? clickedNode.id : undefined,
      variantId: clickedNode.type === 'variant' ? clickedNode.id : undefined,
      symptomTitle: symptom?.title,
      variantName: variant?.name
    });
    
    setShowIndicationManager(true);
  };

  const handleIndicationManagerClose = () => {
    setShowIndicationManager(false);
    // Refresh indication data for the currently clicked node
    if (clickedNode && !indicationData[clickedNode.id]) {
      fetchIndicationData(clickedNode.id);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop: Full Screen Interactive Tree */}
      <div className="hidden md:block fixed inset-0 z-50 bg-white">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-xl font-bold">🌿 The Nerve Vine - Interactive Tree Diagram</h2>
                         <p className="text-sm text-green-100 mt-1">Scroll to navigate, Ctrl+scroll to zoom, click nodes to view indications</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                -
              </button>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                +
              </button>
            </div>
            
            {/* Test Tooltip Button */}
            <button
              onClick={() => {
                console.log('Test button clicked');
                const testPosition = { x: 200, y: 200 };
                console.log('Setting tooltip at position:', testPosition);
                setHerbTooltip({
                  herb: { name: 'Test Herb', slug: 'test-herb', latinName: 'Testus Herbicus', description: 'This is a test herb for debugging' },
                  x: testPosition.x,
                  y: testPosition.y
                });
              }}
              className="px-3 py-1 bg-yellow-500 text-black rounded text-sm hover:bg-yellow-400 transition-colors"
              data-tooltip-button="true"
            >
              Test Tooltip
            </button>
            
            {/* Simple Test Tooltip Button */}
            <button
              onClick={() => {
                console.log('Simple test button clicked');
                setHerbTooltip({
                  herb: { name: 'Simple Test', slug: 'simple-test', description: 'Simple test tooltip' },
                  x: 400,
                  y: 150
                });
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-400 transition-colors"
              data-tooltip-button="true"
            >
              Simple Test
            </button>
            
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

                 {/* Tree Canvas */}
         <div 
           ref={canvasRef}
           className="absolute inset-0 pt-32 overflow-auto cursor-grab active:cursor-grabbing"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onWheel={handleWheel}
         >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600 text-lg">Growing the vine...</span>
            </div>
          ) : (
                         <div 
               className="relative w-full"
               style={{
                 transform: `scale(${zoom})`,
                 transformOrigin: 'top left',
                 minHeight: `${Math.max(600, totalTreeHeight + 100)}px` // Use actual calculated height
               }}
             >
                             {/* Connection Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 {treeNodes.map((node, index) => (
                   <g key={`connections-${node.id}`}>
                                           {/* Horizontal line from symptom to variants */}
                      {node.variants.length > 0 && (
                        <line
                          x1={node.x + node.width}
                          y1={node.y + node.height / 2}
                          x2={node.x + node.width + 20}
                          y2={node.y + node.height / 2}
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      )}
                      
                      {/* Vertical lines to variants */}
                      {node.variants.map((variant) => (
                        <line
                          key={`variant-line-${variant.id}`}
                          x1={node.x + node.width + 20}
                          y1={node.y + node.height / 2}
                          x2={variant.x}
                          y2={variant.y + variant.height / 2}
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                      ))}
                   </g>
                 ))}
               </svg>

                             {/* Symptom Nodes */}
                {treeNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedNode === node.id
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-blue-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    }}
                    onClick={() => {
                      if (clickedNode?.id === node.id && clickedNode?.type === 'symptom') {
                        setClickedNode(null);
                      } else {
                        // Clear any existing indication data for this node
                        setIndicationData(prev => {
                          const newData = { ...prev };
                          delete newData[node.id];
                          return newData;
                        });
                        setClickedNode({ type: 'symptom', id: node.id, x: node.x, y: node.y });
                        fetchIndicationData(node.id);
                      }
                    }}
                  >
                    <div className="p-3 h-full flex flex-col justify-center">
                      <h3 className="font-bold text-blue-800 text-sm text-center leading-tight">
                        {node.title}
                      </h3>
                      <p className="text-blue-600 text-xs text-center mt-1">
                        {node.variants.length} variant{node.variants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}

                             {/* Variant Nodes */}
                {treeNodes.map((node) =>
                  node.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="absolute rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                      style={{
                        left: variant.x,
                        top: variant.y,
                        width: variant.width,
                        height: variant.height,
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                      }}
                      onClick={() => {
                        if (clickedNode?.id === variant.id && clickedNode?.type === 'variant') {
                          setClickedNode(null);
                        } else {
                          // Clear any existing indication data for this node
                          setIndicationData(prev => {
                            const newData = { ...prev };
                            delete newData[variant.id];
                            return newData;
                          });
                          setClickedNode({ type: 'variant', id: variant.id, x: variant.x, y: variant.y });
                          fetchIndicationData(variant.id);
                        }
                      }}
                    >
                      <div className="p-2 h-full flex items-center justify-center">
                        <span className="text-green-800 font-medium text-xs text-center leading-tight">
                          {variant.name}
                        </span>
                      </div>
                    </div>
                  ))
                )}

               {/* Click Tooltip */}
               {clickedNode && (
                 <div 
                   className="absolute z-20 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs"
                   style={{
                     left: clickedNode.type === 'symptom' ? clickedNode.x - 240 : clickedNode.x + 220,
                     top: clickedNode.y - 20,
                   }}
                 >
                   {/* Close Button */}
                   <button
                     onClick={() => setClickedNode(null)}
                     className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                   >
                     ×
                   </button>
                   
                   <div className="space-y-3">
                     <h4 className="font-bold text-gray-800 text-sm border-b border-gray-200">
                       {clickedNode.type === 'symptom' 
                         ? hierarchyData.find(s => s.id === clickedNode.id)?.title 
                         : treeNodes.find(n => n.variants.some(v => v.id === clickedNode.id))?.variants.find(v => v.id === clickedNode.id)?.name
                       }
                     </h4>
                     
                     {indicationData[clickedNode.id] ? (
                       <>
                         {/* Indicated Herbs */}
                         {indicationData[clickedNode.id].herbs.length > 0 && (
                           <div>
                             <h5 className="font-semibold text-green-700 text-xs mb-1">🌿 Indicated Herbs:</h5>
                             <div className="text-xs text-green-800 font-medium">
                               {indicationData[clickedNode.id].herbs.map((herb, index) => (
                                 <span key={herb.id}>
                                   <button
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       console.log('Herb clicked:', herb.name, 'at position:', e.clientX, e.clientY);
                                       console.log('Full herb data:', herb);
                                       setHerbTooltip({
                                         herb,
                                         x: e.clientX,
                                         y: e.clientY
                                       });
                                     }}
                                     className="text-green-800 hover:text-green-600 hover:underline cursor-pointer transition-colors font-medium hover:bg-green-50 px-1 py-0.5 rounded hover:shadow-sm"
                                     data-tooltip-button="true"
                                   >
                                     {herb.name}
                                   </button>
                                   {index < indicationData[clickedNode.id].herbs.length - 1 && ', '}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {/* Indicated Supplements */}
                         {indicationData[clickedNode.id].supplements.length > 0 && (
                           <div>
                             <h5 className="font-semibold text-blue-700 text-xs mb-1">💊 Indicated Supplements:</h5>
                             <div className="text-xs text-blue-800 font-medium">
                               {indicationData[clickedNode.id].supplements.map((supplement, index) => (
                                 <span key={supplement.id}>
                                   <button
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       console.log('Supplement clicked:', supplement.name, 'at position:', e.clientX, e.clientY);
                                       setSupplementTooltip({
                                         supplement,
                                         x: e.clientX,
                                         y: e.clientY
                                       });
                                     }}
                                     className="text-blue-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors font-medium hover:bg-blue-50 px-1 py-0.5 rounded hover:shadow-sm"
                                     data-tooltip-button="true"
                                   >
                                     {supplement.name}
                                   </button>
                                   {index < indicationData[clickedNode.id].supplements.length - 1 && ', '}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {/* Add Indication Button - Always visible */}
                         <button 
                           onClick={handleOpenIndicationManager}
                           className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                         >
                           ✨ Add or Edit Indication
                         </button>
                       </>
                     ) : (
                       <>
                         <div className="text-center py-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto mb-2"></div>
                           <p className="text-xs text-gray-500">Loading indications...</p>
                         </div>
                         
                         {/* Add Indication Button - Always visible even while loading */}
                         <button 
                           onClick={handleOpenIndicationManager}
                           className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                         >
                           ✨ Add or Edit Indication
                         </button>
                       </>
                     )}
                   </div>
                 </div>
               )}

               {/* Summary Overlay */}
               <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg border border-gray-200">
                <div className="text-sm text-gray-600 text-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span><span className="font-semibold text-blue-600">{treeNodes.length}</span> symptoms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span><span className="font-semibold text-green-600">
                        {treeNodes.reduce((sum, node) => sum + node.variants.length, 0)}
                      </span> variants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Simplified Tree View */}
      <div className="md:hidden fixed inset-0 z-50 bg-white">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-4 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-lg font-bold">🌿 The Nerve Vine</h2>
            <p className="text-sm text-green-100">Interactive Tree Diagram</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mobile Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Growing the vine...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {hierarchyData.map((symptom, index) => (
                <div key={symptom.id} className="relative">
                  {/* Main Symptom Node */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="font-bold text-blue-800 text-base">
                            {symptom.title}
                          </h4>
                          <p className="text-blue-600 text-sm">
                            {symptom.variants.length} variant{symptom.variants.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variants Branch */}
                  {symptom.variants.length > 0 && (
                    <div className="ml-6 mt-3 space-y-2">
                      {symptom.variants.map((variant, vIndex) => (
                        <div key={variant.id} className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <h5 className="font-medium text-green-800 text-sm">
                                {variant.name}
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Summary */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="text-center text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{hierarchyData.length}</span> symptoms • 
                  <span className="font-semibold text-green-600 ml-1">
                    {hierarchyData.reduce((sum, symptom) => sum + symptom.variants.length, 0)}
                  </span> variants
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Herb Tooltip */}
      {herbTooltip && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 300, herbTooltip.x + 10)),
            top: Math.max(10, Math.min(window.innerHeight - 200, herbTooltip.y - 10)),
          }}
          data-tooltip="true"
        >
          {/* Close Button */}
          <button
            onClick={() => setHerbTooltip(null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            data-tooltip-button="true"
          >
            ×
          </button>
          
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-base border-b border-gray-200 pb-2 flex items-center">
              <span className="text-green-600 mr-2">🌿</span>
              {herbTooltip.herb.name}
            </h4>
            
            <div className="space-y-2">
              <div>
                <h5 className="font-semibold text-gray-700 text-sm mb-2">🌿 Indicated For:</h5>
                <div className="text-xs text-gray-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                  <p className="font-medium text-green-700">
                    {clickedNode && treeNodes.find(n => n.variants.some(v => v.id === clickedNode.id))?.variants.find(v => v.id === clickedNode.id)?.name}
                  </p>
                  {/* TODO: Add dynamic list of all symptoms/variants this herb is indicated for */}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/herbs/${herbTooltip.herb.slug}`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    🌐 Visit Page
                  </button>
                </Link>
                <Link href={`/herbs/${herbTooltip.herb.slug}/research`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    🔬 Deep Dive
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Supplement Tooltip */}
      {supplementTooltip && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 300, supplementTooltip.x + 10)),
            top: Math.max(10, Math.min(window.innerHeight - 200, supplementTooltip.y - 10)),
          }}
          data-tooltip="true"
        >
          {/* Close Button */}
          <button
            onClick={() => setSupplementTooltip(null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            data-tooltip-button="true"
          >
            ×
          </button>
          
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-base border-b border-gray-200 pb-2 flex items-center">
              <span className="text-blue-600 mr-2">💊</span>
              {supplementTooltip.supplement.name}
            </h4>
            
            <div className="space-y-2">
              <div>
                <h5 className="font-semibold text-gray-700 text-sm mb-2">💊 Indicated For:</h5>
                <div className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                  <p className="font-medium text-blue-700">
                    {clickedNode && treeNodes.find(n => n.variants.some(v => v.id === clickedNode.id))?.variants.find(v => v.id === clickedNode.id)?.name}
                  </p>
                  {/* TODO: Add dynamic list of all symptoms/variants this supplement is indicated for */}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/supplements/${supplementTooltip.supplement.slug}`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    🌐 Visit Page
                  </button>
                </Link>
                <Link href={`/supplements/${supplementTooltip.supplement.slug}/research`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors">
                    🔬 Deep Dive
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Indication Manager Modal */}
      <IndicationManager
        isOpen={showIndicationManager}
        onClose={handleIndicationManagerClose}
        symptomId={indicationManagerData.symptomId}
        variantId={indicationManagerData.variantId}
        symptomTitle={indicationManagerData.symptomTitle}
        variantName={indicationManagerData.variantName}
      />
    </>
  );
}
