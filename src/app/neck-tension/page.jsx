import { redirect } from 'next/navigation';
export default function NeckTensionRedirect() {
    redirect('/symptoms/muscle-tension');
    return null;
}
