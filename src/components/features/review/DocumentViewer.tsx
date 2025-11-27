export default function DocumentViewer() {
    return (
        <div className="h-full flex items-center justify-center text-gray-500 bg-slate-900/50">
            <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-xl">
                <p className="mb-2 text-lg font-medium text-gray-400">Document Preview</p>
                <p className="text-sm text-gray-600">(PDF Rendering would appear here)</p>
            </div>
        </div>
    );
}
