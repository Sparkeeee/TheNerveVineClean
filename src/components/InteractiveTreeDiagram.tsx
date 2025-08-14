'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import IndicationManager from './IndicationManager';

interface HierarchySymptom {
  id: string;
  title: string;
  slug: string;
  variants: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface IndicationData {
  herbs: Array<{ id: string; name: string; slug: string }>;
  supplements: Array<{ id: string; name: string; slug: string }>;
}

interface InteractiveTreeDiagramProps {
  isAdmin?: boolean;
}

interface TreeNode {
  id: string;
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
  id: string;
  name: string;
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function InteractiveTreeDiagram({ isAdmin = false }: InteractiveTreeDiagramProps) {
  const [hierarchyData, setHierarchyData] = useState<HierarchySymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<{ type: 'symptom' | 'variant'; id: string; x: number; y: number } | null>(null);
  const [indicationData, setIndicationData] = useState<Record<string, any>>({});
  const [loadingIndications, setLoadingIndications] = useState<Record<string, boolean>>({});
  const [herbIndications, setHerbIndications] = useState<Record<string, string[]>>({});
  const [supplementIndications, setSupplementIndications] = useState<Record<string, string[]>>({});
  const [herbTooltip, setHerbTooltip] = useState<{ herb: any; x: number; y: number } | null>(null);
  const [supplementTooltip, setSupplementTooltip] = useState<{ supplement: any; x: number; y: number } | null>(null);
  
  // Admin-only state
  const [showIndicationManager, setShowIndicationManager] = useState(false);
  const [indicationManagerData, setIndicationManagerData] = useState<{
    symptomId?: string;
    variantId?: string;
    symptomTitle?: string;
    variantName?: string;
  }>({});
  
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
    fetchHierarchyData();
  }, []);

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

  const fetchIndicationData = async (id: string) => {
    try {
      // Set loading state for this ID FIRST
      setLoadingIndications(prev => {
        const newState = { ...prev, [id]: true };
        console.log(`🔄 Set loading state for ${id}: true`);
        console.log(`🔄 Previous state:`, prev);
        console.log(`🔄 New state:`, newState);
        return newState;
      });
      
      console.log(`🔍 Fetching indications for ID: "${id}"`);
      console.log(`🔍 Current hierarchyData:`, hierarchyData);
      console.log(`🔍 Current treeNodes:`, treeNodes);
      
      // Check if this ID is a symptom or variant
      const isSymptom = treeNodes.some(n => n.id.toString() === id);
      const isVariant = treeNodes.some(n => n.variants.some(v => v.id.toString() === id));
      
      console.log(`🔍 ID analysis:`, { id, isSymptom, isVariant, treeNodesLength: treeNodes.length });
      
      if (!isSymptom && !isVariant) {
        console.warn('❌ ID not found in tree data:', id);
        console.warn('🔍 Available IDs in treeNodes:', treeNodes.map(n => ({ id: n.id, title: n.title })));
        setLoadingIndications(prev => ({ ...prev, [id]: false }));
        return;
      }

      let targetId = id;
      let targetType = 'symptom';
      
      if (isVariant) {
        // For variants, use the variant ID directly to get variant-specific indications
        targetId = id;
        targetType = 'variant';
      } else if (isSymptom) {
        // For symptoms, we want to get symptom-level indications from the JSON columns
        targetType = 'symptom';
      }

      console.log(`🌐 API call: /api/symptoms/${targetId}/indications?targetType=${targetType}`);
      
      const response = await fetch(`/api/symptoms/${targetId}/indications?targetType=${targetType}`);
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ API response for ${id}:`, result);
        if (result.success && result.data) {
          // Store the data with the original clicked ID (could be symptom or variant)
          setIndicationData(prev => {
            const newData = {
              ...prev,
              [id]: result.data
            };
            console.log(`💾 Updated indicationData:`, newData);
            console.log(`🔍 Stored data for ID "${id}":`, result.data);
            return newData;
          });
        } else {
          console.warn(`⚠️ API response missing data:`, result);
        }
      } else {
        console.error(`❌ API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error fetching indication data:', error);
    } finally {
      // Clear loading state for this ID
      setLoadingIndications(prev => {
        const newState = { ...prev, [id]: false };
        console.log(`✅ Cleared loading state for ${id}: false`);
        console.log(`✅ Previous state:`, prev);
        console.log(`✅ New state:`, newState);
        return newState;
      });
    }
  };

  // Calculate tree layout
  const calculateTreeLayout = () => {
    const nodes: TreeNode[] = [];
    const nodeWidth = 120;
    const nodeHeight = 60;
    const variantHeight = 50; // Increased from 40
    const horizontalSpacing = 25; // Reduced from 40 to bring symptoms and variants closer
    const verticalSpacing = 80;
    const variantVerticalSpacing = 50; // Back to original
    const groupSpacing = 30; // Reduced from 60 to bring symptom groups even closer together

    let currentY = pan.y + 20; // Start position
    
    // Use a fixed center position that works reliably
    const variantX = 400; // Decreased from 800 to move tree LEFT so centerline aligns with variant left borders
    const symptomX = variantX - nodeWidth - horizontalSpacing; // Position symptoms to the left

    // Debug logging
    console.log('Tree layout calculation - pan:', pan, 'hierarchyData length:', hierarchyData.length, 'variantX:', variantX);

    hierarchyData.forEach((symptom, index) => {
      // Debug logging for first few nodes
      if (index < 3) {
        console.log(`Symptom ${index}: x=${symptomX}, y=${currentY}, pan.x=${pan.x}, variantX=${variantX}`);
      }
      
      // Calculate how much vertical space this symptom group needs
      const variantsHeight = symptom.variants.length > 0 
        ? (symptom.variants.length - 1) * variantVerticalSpacing + variantHeight
        : 0;
      const totalGroupHeight = Math.max(nodeHeight, variantsHeight);
      
      const variants: TreeNodeVariant[] = symptom.variants.map((variant, vIndex) => ({
        ...variant,
        x: variantX, // Fixed center position for left edge of variants
        y: currentY + (vIndex * variantVerticalSpacing), // Stack variants vertically under their symptom
        width: Math.max(140, variant.name.length * 8), // Dynamic width based on text length, minimum 140px
        height: variantHeight - 5
      }));

      nodes.push({
        ...symptom,
        x: symptomX,
        y: currentY,
        width: nodeWidth,
        height: nodeHeight,
        variants,
        isExpanded: true
      });

      // Move to next position: current group height + spacing
      currentY += totalGroupHeight + groupSpacing;
    });

    console.log('Final tree layout - nodes:', nodes.length, 'totalHeight:', currentY);
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

  const toggleNodeExpansion = (nodeId: string) => {
    // In a real implementation, you'd update the node's isExpanded state
    // For now, we'll just toggle the selected node
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleOpenIndicationManager = () => {
    if (!clickedNode) return;
    
    console.log('🔍 handleOpenIndicationManager - clickedNode:', clickedNode);
    console.log('🔍 treeNodes structure:', treeNodes);
    
    let symptom = null;
    let variant = null;
    
    if (clickedNode.type === 'symptom') {
      // If clicking on a symptom, find it directly
      symptom = treeNodes.find(n => n.id === clickedNode.id);
      console.log('🔍 Looking for symptom with ID:', clickedNode.id);
    } else if (clickedNode.type === 'variant') {
      // If clicking on a variant, find the parent symptom that contains this variant
      console.log('🔍 Looking for parent symptom containing variant ID:', clickedNode.id);
      console.log('🔍 Searching through treeNodes:', treeNodes.map(n => ({ id: n.id, title: n.title, variants: n.variants?.map(v => ({ id: v.id, name: v.name })) })));
      
      symptom = treeNodes.find(n => n.variants.some(v => v.id.toString() === clickedNode.id));
      if (symptom) {
        variant = symptom.variants.find(v => v.id.toString() === clickedNode.id);
      }
    }
    
    console.log('🔍 Found symptom:', symptom);
    console.log('🔍 Found variant:', variant);
    
    setIndicationManagerData({
      symptomId: clickedNode.type === 'symptom' ? clickedNode.id : undefined,
      variantId: clickedNode.type === 'variant' ? clickedNode.id : undefined,
      symptomTitle: symptom?.title,
      variantName: variant?.name
    });
    
    console.log('🔍 Set indicationManagerData with:', {
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

  const handleHerbClick = (herb: any, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('🌿 Herb clicked:', herb.name, 'at position:', event.clientX, event.clientY);
    console.log('🌿 Full herb data:', herb);
    
    // Fetch what this herb is indicated for
    fetchHerbIndications(herb.id);
    
    setHerbTooltip({
      herb,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleSupplementClick = (supplement: any, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('💊 Supplement clicked:', supplement.name, 'at position:', event.clientX, event.clientY);
    
    // Fetch what this supplement is indicated for
    fetchSupplementIndications(supplement.id);
    
    setSupplementTooltip({
      supplement,
      x: event.clientX,
      y: event.clientY
    });
  };

  const fetchHerbIndications = async (herbId: string) => {
    try {
      console.log(`🔍 Finding what herb ${herbId} is indicated for...`);
      console.log(`🔍 Current indicationData:`, indicationData);
      
      const indications: string[] = [];
      
      // Search through all loaded indication data for this herb
      Object.entries(indicationData).forEach(([symptomId, data]) => {
        console.log(`🔍 Checking symptom ID: ${symptomId} for herb ${herbId}`);
        console.log(`🔍 Symptom data:`, data);
        
        // Check if herb is in symptom's herbs
        if (data.herbs && Array.isArray(data.herbs)) {
          const herbFound = data.herbs.some(herb => herb.id === parseInt(herbId));
          if (herbFound) {
            console.log(`✅ Found herb ${herbId} in symptom ID: ${symptomId}`);
            // Find the symptom name from treeNodes
            const symptom = treeNodes.find(n => n.id.toString() === symptomId);
            if (symptom) {
              indications.push(symptom.title);
            }
          }
        }
        
        // Check if herb is in symptom's supplements (in case it's stored there)
        if (data.supplements && Array.isArray(data.supplements)) {
          const herbFound = data.supplements.some(supplement => supplement.id === parseInt(herbId));
          if (herbFound) {
            console.log(`✅ Found herb ${herbId} in supplements for symptom ID: ${symptomId}`);
            const symptom = treeNodes.find(n => n.id.toString() === symptomId);
            if (symptom) {
              indications.push(symptom.title);
            }
          }
        }
      });
      
      // Also search through variant-level indications
      console.log(`🔍 Searching for variant-level indications...`);
      treeNodes.forEach(symptom => {
        symptom.variants.forEach(variant => {
          // Check if this variant has indication data loaded
          if (indicationData[variant.id.toString()]) {
            const variantData = indicationData[variant.id.toString()];
            console.log(`🔍 Checking variant: ${variant.name} (ID: ${variant.id})`);
            console.log(`🔍 Variant data:`, variantData);
            
            // Check if herb is in variant's herbs
            if (variantData.herbs && Array.isArray(variantData.herbs)) {
              const herbFound = variantData.herbs.some(herb => herb.id === parseInt(herbId));
              if (herbFound) {
                console.log(`✅ Found herb ${herbId} in variant: ${variant.name}`);
                indications.push(variant.name);
              }
            }
            
            // Check if herb is in variant's supplements
            if (variantData.supplements && Array.isArray(variantData.supplements)) {
              const herbFound = variantData.supplements.some(supplement => supplement.id === parseInt(herbId));
              if (herbFound) {
                console.log(`✅ Found herb ${herbId} in variant supplements: ${variant.name}`);
                indications.push(variant.name);
              }
            }
          }
        });
      });
      
      console.log(`✅ Herb ${herbId} is indicated for:`, indications);
      
      // Store the indications for display in tooltip
      setHerbIndications(prev => {
        const newState = { ...prev, [herbId]: indications };
        console.log(`💾 Updated herbIndications:`, newState);
        return newState;
      });
      
    } catch (error) {
      console.error('❌ Error finding herb indications:', error);
    }
  };

  const fetchSupplementIndications = async (supplementId: string) => {
    try {
      console.log(`🔍 Finding what supplement ${supplementId} is indicated for...`);
      
      const indications: string[] = [];
      
      // Search through all symptoms and variants for this supplement
      hierarchyData.forEach(symptom => {
        // Check if supplement is in symptom's supplements JSON
        if (symptom.supplements && Array.isArray(symptom.supplements) && symptom.supplements.includes(parseInt(supplementId))) {
          indications.push(symptom.title);
        }
        
        // Check if supplement is in any of the symptom's variants
        symptom.variants.forEach(variant => {
          if (variant.supplements && Array.isArray(variant.supplements) && variant.supplements.includes(parseInt(supplementId))) {
            indications.push(variant.name);
          }
        });
      });
      
      console.log(`✅ Supplement ${supplementId} is indicated for:`, indications);
      
      // Store the indications for display in tooltip
      setSupplementIndications(prev => ({
        ...prev,
        [supplementId]: indications
      }));
      
    } catch (error) {
      console.error('❌ Error finding supplement indications:', error);
    }
  };

  return (
    <>
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10" style={{
        backgroundImage: "url('/images/RoseWPWM.PNG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0 bg-pink-100 opacity-90"></div>
      </div>

      {/* Modal Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white bg-opacity-95 border-b border-gray-200 px-6 py-4 h-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">🌿 Interactive Tree Diagram</h2>
            <p className="text-sm text-gray-600 mt-1">Navigate the complete symptom hierarchy</p>
          </div>
          <div className="absolute right-6">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tree Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            ref={canvasRef}
            className="w-full h-full overflow-y-auto overflow-x-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <span className="text-gray-600 text-lg">Growing the vine...</span>
                </div>
              </div>
            ) : (
              <div 
                className="relative w-full max-w-5xl mx-auto"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  minHeight: `${Math.max(800, totalTreeHeight + 200)}px`
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
                          x2={variant.x + variant.width / 2}
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
                    className={`absolute rounded-lg border-2 transition-all duration-200 cursor-pointer bg-white shadow-sm hover:bg-amber-50 hover:border-gray-400 hover:shadow-gray-300 hover:shadow-lg ${
                      selectedNode === node.id
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-300'
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                    }}
                    onMouseDown={() => console.log(`🖱️ Mouse down on symptom: ${node.title}`)}
                    onClick={() => {
                      console.log(`🖱️ Symptom "${node.title}" clicked with ID: ${node.id}`);
                      console.log(`🔍 Click event fired for:`, { title: node.title, id: node.id, type: typeof node.id });
                      console.log(`🚨 ABOUT TO CALL fetchIndicationData with ID: ${node.id.toString()}`);
                      if (clickedNode?.id === node.id.toString() && clickedNode?.type === 'symptom') {
                        console.log(`🔄 Closing symptom tooltip for: ${node.title} (ID: ${node.id})`);
                        setClickedNode(null);
                      } else {
                        console.log(`🟦 Opening symptom tooltip for: ${node.title} (ID: ${node.id})`);
                        // Clear any existing indication data for this node
                        setIndicationData(prev => {
                          const newData = { ...prev };
                          delete newData[node.id.toString()];
                          console.log(`🗑️ Cleared indication data for ${node.id}, new data:`, newData);
                          return newData;
                        });
                        setClickedNode({ type: 'symptom', id: node.id.toString(), x: node.x, y: node.y });
                        console.log(`📞 Calling fetchIndicationData for symptom ${node.id}`);
                        console.log(`🚨 EXECUTING: fetchIndicationData("${node.id.toString()}")`);
                        fetchIndicationData(node.id.toString());
                        console.log(`✅ fetchIndicationData call completed`);
                      }
                    }}
                  >
                    <div className="p-3 h-full flex flex-col justify-center">
                      <h3 className="font-bold text-blue-800 text-sm text-center leading-tight">
                        {node.title}
                      </h3>
                    </div>
                  </div>
                ))}

                {/* Variant Nodes */}
                {treeNodes.map((node) =>
                  node.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="absolute rounded-lg border-2 border-gray-300 hover:bg-amber-50 hover:border-gray-400 hover:shadow-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white shadow-sm"
                      style={{
                        left: variant.x,
                        top: variant.y,
                        width: variant.width,
                        height: variant.height,
                      }}
                      onMouseDown={() => console.log(`🖱️ Mouse down on variant: ${variant.name}`)}
                      onClick={() => {
                        console.log(`🖱️ Variant "${variant.name}" clicked with ID: ${variant.id}`);
                        console.log(`🔍 Click event fired for variant:`, { name: variant.name, id: variant.id, type: typeof variant.id });
                        console.log(`🚨 ABOUT TO CALL fetchIndicationData with ID: ${variant.id.toString()}`);
                        if (clickedNode?.id === variant.id.toString() && clickedNode?.type === 'variant') {
                          console.log(`🔄 Closing variant tooltip for: ${variant.name} (ID: ${variant.id})`);
                          setClickedNode(null);
                        } else {
                          console.log(`🟩 Opening variant tooltip for: ${variant.name} (ID: ${variant.id})`);
                          // Clear any existing indication data for this node
                          setIndicationData(prev => {
                            const newData = { ...prev };
                            delete newData[variant.id.toString()];
                            console.log(`🗑️ Cleared indication data for ${variant.id}, new data:`, newData);
                            return newData;
                          });
                          setClickedNode({ type: 'variant', id: variant.id.toString(), x: variant.x, y: variant.y });
                          console.log(`📞 Calling fetchIndicationData for variant ${variant.id}`);
                          console.log(`🚨 EXECUTING: fetchIndicationData("${variant.id.toString()}")`);
                          fetchIndicationData(variant.id.toString());
                          console.log(`✅ fetchIndicationData call completed`);
                        }
                      }}
                    >
                      <div className="p-2 h-full flex items-center justify-center text-center">
                        <span className="text-green-600 font-medium text-xs leading-tight break-words" style={{ wordBreak: 'break-word', lineHeight: '1.2' }}>
                          {variant.name}
                        </span>
                      </div>
                    </div>
                  ))
                )}

                {/* Click Tooltip */}
                {clickedNode && (
                  <div 
                    className="absolute z-20 bg-white rounded-lg shadow-lg border-2 border-gray-300 p-4 max-w-xs"
                    style={{
                      left: (() => {
                        // Calculate preferred position
                        let preferredLeft;
                        if (clickedNode.type === 'symptom') {
                          preferredLeft = clickedNode.x - 200; // Show to the left of symptom nodes
                        } else {
                          preferredLeft = clickedNode.x + 160; // Show to the right of variant nodes
                        }
                        
                        // Debug logging
                        console.log('Tooltip positioning:', {
                          nodeType: clickedNode.type,
                          nodeX: clickedNode.x,
                          preferredLeft,
                          finalLeft: Math.max(10, Math.min(600, preferredLeft))
                        });
                        
                        // Ensure tooltip stays within bounds (0 to 600px)
                        return Math.max(10, Math.min(600, preferredLeft));
                      })(),
                      top: Math.max(10, Math.min(400, clickedNode.y - 20)),
                    }}
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setClickedNode(null)}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      ×
                    </button>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {clickedNode.type === 'symptom' 
                          ? hierarchyData.find(s => s.id === clickedNode.id)?.title 
                          : (() => {
                              // Use the same logic as handleOpenIndicationManager
                              const parentSymptom = treeNodes.find(n => n.variants.some(v => v.id.toString() === clickedNode.id));
                              if (parentSymptom) {
                                const variant = parentSymptom.variants.find(v => v.id.toString() === clickedNode.id);
                                return variant?.name;
                              }
                              return 'Unknown Variant';
                            })()
                        }
                      </h3>
                      
                      {/* Herbs Section */}
                      {indicationData[clickedNode.id]?.herbs && indicationData[clickedNode.id].herbs.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-green-700 mb-2">Indicated Herbs:</h4>
                          <div className="space-y-2">
                            {indicationData[clickedNode.id].herbs.map((herb, index) => (
                              <div key={herb.id} className="flex items-center justify-between">
                                <span 
                                  className="text-green-600 cursor-pointer hover:text-green-800 hover:underline"
                                  onClick={(e) => handleHerbClick(herb, e)}
                                >
                                  {herb.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Supplements Section */}
                      {indicationData[clickedNode.id]?.supplements && indicationData[clickedNode.id].supplements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-blue-700 mb-2">Indicated Supplements:</h4>
                          <div className="space-y-2">
                            {indicationData[clickedNode.id].supplements.map((supplement, index) => (
                              <div key={supplement.id} className="flex items-center justify-between">
                                <span 
                                  className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                                  onClick={(e) => handleSupplementClick(supplement, e)}
                                >
                                  {supplement.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Loading State */}
                      {loadingIndications[clickedNode.id] && (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">Loading indications...</p>
                          <p className="text-xs text-gray-400 mt-1">Debug: loadingIndications[{clickedNode.id}] = {loadingIndications[clickedNode.id] ? 'true' : 'false'}</p>
                        </div>
                      )}
                      
                      {/* No Indications Message */}
                      {!loadingIndications[clickedNode.id] && 
                       (!indicationData[clickedNode.id]?.herbs || indicationData[clickedNode.id].herbs.length === 0) &&
                       (!indicationData[clickedNode.id]?.supplements || indicationData[clickedNode.id].supplements.length === 0) && (
                        <div>
                          <p className="text-gray-500 text-sm mb-2">No indications set for this {clickedNode.type === 'symptom' ? 'symptom' : 'variant'}.</p>
                          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border">
                            <p><strong>Debug Info:</strong></p>
                            <p>Clicked Node ID: "{clickedNode.id}" (type: {typeof clickedNode.id})</p>
                            <p>Loading State: loadingIndications[{clickedNode.id}] = {loadingIndications[clickedNode.id] ? 'true' : 'false'}</p>
                            <p>Available indicationData keys: {Object.keys(indicationData).join(', ')}</p>
                            <p>Data for this ID: {JSON.stringify(indicationData[clickedNode.id])}</p>
                            <p><strong>Loading State Debug:</strong></p>
                            <p>loadingIndications[clickedNode.id]: {loadingIndications[clickedNode.id] ? 'TRUE' : 'FALSE'}</p>
                            <p>All loadingIndications keys: {Object.keys(loadingIndications).join(', ')}</p>
                            <p><strong>Tooltip Debug:</strong></p>
                            <p>indicationData[clickedNode.id] exists: {indicationData[clickedNode.id] ? 'YES' : 'NO'}</p>
                            <p>indicationData[clickedNode.id]?.herbs: {indicationData[clickedNode.id]?.herbs ? 'EXISTS' : 'NO'}</p>
                            <p>indicationData[clickedNode.id]?.herbs?.length: {indicationData[clickedNode.id]?.herbs?.length || 'UNDEFINED'}</p>
                            <p>Full indicationData object: {JSON.stringify(indicationData, null, 2)}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Admin-only Add/Edit Indication Button */}
                      {isAdmin && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button 
                            onClick={handleOpenIndicationManager}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                          >
                            Add or Edit Indication
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Summary Overlay */}
                <div className="absolute bottom-6 right-6 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="text-sm text-gray-600 text-center">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span><span className="font-semibold text-blue-600">{treeNodes.length}</span> symptoms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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

        {/* Footer */}
        <div className="flex-shrink-0 bg-white bg-opacity-95 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>🖱️ Scroll to navigate</span>
              <span>⌨️ Ctrl+scroll to zoom</span>
              <span>👆 Click nodes to explore</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Herb Tooltip */}
      {herbTooltip && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 300, herbTooltip.x + 10)),
            top: Math.max(10, Math.min(window.innerHeight - 200, herbTooltip.y - 100))
          }}
          data-tooltip="true"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-green-700">{herbTooltip.herb.name}</h4>
            <button
              onClick={() => setHerbTooltip(null)}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="mb-3">
            <span className="text-sm text-gray-600">Indicated for:</span>
            <div className="mt-1 p-2 bg-green-50 rounded border border-green-200 min-h-[20px]">
              {herbIndications[herbTooltip.herb.id] && herbIndications[herbTooltip.herb.id].length > 0 ? (
                <span className="text-sm text-green-800">
                  {herbIndications[herbTooltip.herb.id].join(', ')}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">Loading indications...</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/herbs/${herbTooltip.herb.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center"
            >
              Visit Page
            </Link>
            <Link
              href={`/herbs/${herbTooltip.herb.slug}/research`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center"
            >
              Deep Dive
            </Link>
          </div>
        </div>
      )}
      
      {/* Supplement Tooltip */}
      {supplementTooltip && (
        <div
          className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 300, supplementTooltip.x + 10)),
            top: Math.max(10, Math.min(window.innerHeight - 200, supplementTooltip.y - 100))
          }}
          data-tooltip="true"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-blue-700">{supplementTooltip.supplement.name}</h4>
            <button
              onClick={() => setSupplementTooltip(null)}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="mb-3">
            <span className="text-sm text-gray-600">Indicated for:</span>
            <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-200 min-h-[20px]">
              {supplementIndications[supplementTooltip.supplement.id] && supplementIndications[supplementTooltip.supplement.id].length > 0 ? (
                <span className="text-sm text-blue-800">
                  {supplementIndications[supplementTooltip.supplement.id].join(', ')}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">Loading indications...</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/supplements/${supplementTooltip.supplement.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center"
            >
              Visit Page
            </Link>
            <Link
              href={`/supplements/${supplementTooltip.supplement.slug}/research`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors text-center"
            >
              Deep Dive
            </Link>
          </div>
        </div>
      )}
      
      {/* Indication Manager Modal - Admin Only */}
      {isAdmin && (
        <IndicationManager
          isOpen={showIndicationManager}
          onClose={handleIndicationManagerClose}
          symptomId={indicationManagerData.symptomId}
          variantId={indicationManagerData.variantId}
          symptomTitle={indicationManagerData.symptomTitle}
          variantName={indicationManagerData.variantName}
        />
      )}
    </>
  );
}
