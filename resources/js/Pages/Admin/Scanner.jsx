import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import AdminLayout from '../../Layouts/AdminLayout';

const READER_ID = 'qr-reader';

export default function Scanner() {
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);

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
                () => {}
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
            <p className="text-sm text-gray-500 -mt-4 mb-6">Scan tickets to verify attendee entry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-0.5">Camera Feed</h2>
                    <p className="text-sm text-gray-500 mb-4">Position the QR code within the frame</p>

                    <div id={READER_ID} className="rounded-xl overflow-hidden bg-gray-900 min-h-[220px]" />

                    <div className="flex flex-col gap-2.5 mt-4">
                        {status !== 'scanning' && (
                            <button
                                onClick={startCamera}
                                className="bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 shadow-sm shadow-red-500/25 transition-all duration-200"
                            >
                                Request Camera Permissions
                            </button>
                        )}
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-0.5">Verification Result</h2>
                    <p className="text-sm text-gray-500 mb-4">Scan a ticket to see details here</p>

                    {!result && (
                        <div className="flex items-center justify-center h-40 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                            Waiting for scan...
                        </div>
                    )}

                    {result && (
                        <div
                            className={`rounded-xl p-5 border ${
                                result.status === 'valid'
                                    ? 'border-green-200 bg-green-50'
                                    : result.status === 'duplicate'
                                    ? 'border-yellow-200 bg-yellow-50'
                                    : 'border-red-200 bg-red-50'
                            }`}
                        >
                            <div className="font-bold mb-1 text-gray-900">
                                {result.status === 'valid' && '✅ Valid ticket'}
                                {result.status === 'duplicate' && '⚠️ Already used'}
                                {(!result.status || result.status === 'invalid') && '❌ Invalid ticket'}
                            </div>
                            <p className="text-sm text-gray-600">{result.message}</p>
                            {result.ticket && (
                                <div className="text-sm text-gray-500 mt-2">
                                    <div>Event: <span className="font-medium text-gray-700">{result.ticket.event}</span></div>
                                    <div>Attendee: <span className="font-medium text-gray-700">{result.ticket.attendee}</span></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
