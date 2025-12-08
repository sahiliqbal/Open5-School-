
import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle, Calendar, ChevronRight, DollarSign, Loader2 } from 'lucide-react';
import { FeeInvoice } from '../types';
import { MOCK_FEES } from '../constants';

interface FeePaymentProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeePayment: React.FC<FeePaymentProps> = ({ isOpen, onClose }) => {
    // Local state to simulate database updates
    const [invoices, setInvoices] = useState<FeeInvoice[]>(MOCK_FEES);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setInvoices(MOCK_FEES); 
            setShowSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const pendingInvoices = invoices.filter(inv => inv.status !== 'PAID');
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    
    const totalDue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const handlePayNow = () => {
        if (totalDue === 0) return;

        setIsProcessing(true);
        
        // Simulate network request
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            
            // Mark all pending as paid
            setInvoices(prev => prev.map(inv => ({
                ...inv,
                status: 'PAID'
            })));

            // Auto close after success
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 2500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#F8F9FA] w-full sm:max-w-md h-[90vh] sm:h-[650px] rounded-t-[40px] sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex justify-between items-center z-10 bg-white/50 backdrop-blur-sm sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Fee Details</h2>
                        <p className="text-xs text-slate-400 font-medium">Academic Year 2024-2025</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-28 no-scrollbar">
                    
                    {/* Total Due Card */}
                    <div className="relative w-full bg-gradient-to-br from-[#FF7F43] to-[#FF6B6B] rounded-[32px] p-6 text-white shadow-xl shadow-orange-200/50 mb-8 overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-orange-100 text-xs font-bold uppercase tracking-wider border border-orange-100/30 px-2 py-1 rounded-lg">
                                    Total Outstanding
                                </span>
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                    <DollarSign size={20} className="text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold mb-1">${totalDue.toLocaleString()}</h1>
                            <p className="text-orange-100 text-sm opacity-90">Due by Feb 28, 2024</p>
                        </div>
                        
                        {/* Decorative Circles */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                    </div>

                    {/* Pending Invoices */}
                    {pendingInvoices.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-slate-800 font-bold text-lg mb-3 flex items-center gap-2">
                                Pending Invoices 
                                <span className="bg-orange-100 text-orange-500 text-[10px] px-2 py-0.5 rounded-full">{pendingInvoices.length}</span>
                            </h3>
                            <div className="space-y-3">
                                {pendingInvoices.map((inv) => (
                                    <div key={inv.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                                <AlertCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-700 text-sm">{inv.month}</h4>
                                                <p className="text-xs text-slate-400 font-medium">Due: {inv.dueDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800 text-lg">${inv.amount}</p>
                                            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">Unpaid</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment Method Selector (Mock) */}
                    {totalDue > 0 && (
                        <div className="mb-6">
                            <h3 className="text-slate-800 font-bold text-lg mb-3">Payment Method</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                <button 
                                    onClick={() => setSelectedMethod('card')}
                                    className={`min-w-[140px] p-4 rounded-[24px] border-2 transition-all text-left relative overflow-hidden ${selectedMethod === 'card' ? 'border-[#5D8BF4] bg-blue-50' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className="mb-3 text-[#5D8BF4]"><CreditCard size={24} /></div>
                                    <p className="font-bold text-slate-700 text-sm">Visa **** 4242</p>
                                    <p className="text-[10px] text-slate-400">Expires 12/25</p>
                                    {selectedMethod === 'card' && <div className="absolute top-3 right-3 w-4 h-4 bg-[#5D8BF4] rounded-full flex items-center justify-center"><CheckCircle size={10} className="text-white"/></div>}
                                </button>
                                <button 
                                    onClick={() => setSelectedMethod('apple')}
                                    className={`min-w-[140px] p-4 rounded-[24px] border-2 transition-all text-left relative ${selectedMethod === 'apple' ? 'border-slate-800 bg-slate-100' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className="mb-3 text-slate-800">
                                         {/* Simple Apple Icon Mock */}
                                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.8 10.6c-.2 2 1.8 3 1.9 3-1.6 2.3-2.2 2.8-3.9 2.8-1.5 0-2-.9-3.7-.9-1.8 0-2.3.9-3.7.9-1.5 0-2.3-.8-3.1-1.9C3.4 11.6 4.6 6.3 7.8 6.3c1.5 0 2.6 1 3.4 1 .8 0 2.1-1.3 3.6-1.3 1.2 0 2.2.8 2.8 1.2-.1.1-.7.4-.8.8v.1c.1 1.2 1 2.3 1 2.5zM12.3 4.6c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.6 1.3-.6.7-1.2 1.9-1 3 .9.1 2-.7 2.6-1.3z"/></svg>
                                    </div>
                                    <p className="font-bold text-slate-700 text-sm">Apple Pay</p>
                                    <p className="text-[10px] text-slate-400">Default</p>
                                    {selectedMethod === 'apple' && <div className="absolute top-3 right-3 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center"><CheckCircle size={10} className="text-white"/></div>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paid History */}
                    {paidInvoices.length > 0 && (
                        <div>
                            <h3 className="text-slate-800 font-bold text-lg mb-3">Payment History</h3>
                            <div className="space-y-3 opacity-80">
                                {paidInvoices.map((inv) => (
                                    <div key={inv.id} className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-600 text-sm">{inv.month}</h4>
                                                <p className="text-xs text-slate-400 font-medium">Paid on {inv.dueDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-600 text-base">${inv.amount}</p>
                                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide">Paid</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs font-bold">Selected Amount</span>
                        <span className="text-slate-800 text-lg font-bold">${totalDue.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={handlePayNow}
                        disabled={totalDue === 0 || isProcessing || showSuccess}
                        className={`w-full py-4 rounded-[24px] font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                            totalDue === 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                            : showSuccess
                                ? 'bg-emerald-500 text-white shadow-emerald-200'
                                : 'bg-[#FF7F43] hover:bg-[#ff8f5a] text-white shadow-orange-200'
                        }`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Processing...
                            </>
                        ) : showSuccess ? (
                            <>
                                <CheckCircle size={24} />
                                Payment Successful!
                            </>
                        ) : (
                            <>
                                Pay Now <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>

                {/* Success Overlay Animation */}
                {showSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-500/90 backdrop-blur-sm animate-in fade-in duration-300">
                         <div className="text-center text-white scale-110 animate-in zoom-in duration-300">
                             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                 <CheckCircle size={48} className="text-emerald-500" />
                             </div>
                             <h2 className="text-3xl font-bold mb-1">Paid!</h2>
                             <p className="text-emerald-100 font-medium">Receipt sent to email</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};
