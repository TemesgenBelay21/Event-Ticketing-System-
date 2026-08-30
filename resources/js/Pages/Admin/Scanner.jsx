import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import AdminLayout from '../../Layouts/AdminLayout';

const READER_ID = 'qr-reader';

export default function Scanner() {
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle | scanning | result
    const [result, setResult] = useState(null); // { status, message, ticket }

    useEffect(() => {
        scannerRef.current = new Html5Qrcode(READER_ID);
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    async function verify(barcode) {
        try {
            const res = await window.axios.post('/admin/scanner/verify', { barcode });
            setResult({ ok: true, ...res.data });
        } catch (err) {
            setResult({ ok: false, ...(err.response?.data ?? { message: 'Something went wrong.' }) });
        }
    }

    async function startCamera() {
        setStatus('scanning');
        setResult(null);
        try {
            await scannerRef.current.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 220 },
                async (decodedText) => {
                    await scannerRef.current.stop();
                    setStatus('idle');
                    verify(decodedText);
                },
                () => {} // ignore per-frame scan failures
            );
        } catch (err) {
            setStatus('idle');
            setResult({ ok: false, message: 'Could not access camera. Try uploading an image instead.' });
        }
    }

    async function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setResult(null);
        try {
            const decodedText = await scannerRef.current.scanFile(file, true);
            verify(decodedText);
        } catch (err) {
            setResult({ ok: false, message: 'Could not read a QR code from that image.' });
        }
        e.target.value = '';
    }

    return (
        <AdminLayout title="Ticket Scanner">
            <Head title="Scanner" />
            <p className="text-sm text-gray-400 -mt-4 mb-6">Scan tickets to verify attendee entry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                    <h2 className="font-medium mb-1">Camera Feed</h2>
                    <p className="text-sm text-gray-400 mb-4">Position the QR code within the frame</p>

                    <div id={READER_ID} className="rounded-lg overflow-hidden bg-black min-h-[220px]" />

                    <div className="flex flex-col gap-2 mt-4">
                        {status !== 'scanning' && (
                            <button
                                onClick={startCamera}
                                className="border border-gray-700 rounded py-2 text-sm hover:bg-gray-800"
                            >
                                Request Camera Permissions
                            </button>
                        )}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="border border-gray-700 rounded py-2 text-sm hover:bg-gray-800"
                        >
                            Upload Ticket Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFile}
                        />
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                    <h2 className="font-medium mb-1">Verification Result</h2>
                    <p className="text-sm text-gray-400 mb-4">Scan a ticket to see details here</p>

                    {!result && (
                        <div className="flex items-center justify-center h-40 text-gray-500 text-sm border border-dashed border-gray-800 rounded-lg">
                            Waiting for scan...
                        </div>
                    )}

                    {result && (
                        <div
                            className={`rounded-lg p-4 border ${
                                result.status === 'valid'
                                    ? 'border-green-700 bg-green-950/40'
                                    : result.status === 'duplicate'
                                    ? 'border-yellow-700 bg-yellow-950/40'
                                    : 'border-red-700 bg-red-950/40'
                            }`}
                        >
                            <div className="font-medium mb-1">
                                {result.status === 'valid' && '✅ Valid ticket'}
                                {result.status === 'duplicate' && '⚠️ Already used'}
                                {(!result.status || result.status === 'invalid') && '❌ Invalid ticket'}
                            </div>
                            <p className="text-sm text-gray-300">{result.message}</p>
                            {result.ticket && (
                                <div className="text-sm text-gray-400 mt-2">
                                    <div>Event: {result.ticket.event}</div>
                                    <div>Attendee: {result.ticket.attendee}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
