import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, Loader, CheckCircle2, FileDown, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatWhatsAppMessage } from '../../utils/whatsapp';
import { calculateTotal, calculateQuantity } from '../../utils/cart';
import { generateOrderPDF } from '../../utils/generatePDF';
import { api } from '../../lib/api';

export default function CartSidebar() {
    const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart } = useCart();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [sending, setSending] = useState(false);
    // Après envoi : { orderNumber, pdfUrl, whatsappUrl } pour l'écran de confirmation.
    const [confirmation, setConfirmation] = useState(null);

    const total = calculateTotal(cart);
    const totalQty = calculateQuantity(cart);

    const handleSend = async () => {
        setSending(true);
        try {
            // La commande est enregistrée en base AVANT l'ouverture de WhatsApp :
            // même si le client n'envoie pas le message, rien n'est perdu.
            const res = await api.createOrder({
                client_name: name,
                phone,
                items: cart.map(({ name: n, category, quantity, price }) => ({
                    name: n, category, quantity, price,
                })),
            });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            window.open(data.whatsappUrl, '_blank');
            setConfirmation(data);
            clearCart();
        } catch {
            // Repli hors-ligne : PDF généré dans le navigateur + message WhatsApp
            // sans lien (l'ancien comportement).
            const client = { name, phone };
            const orderNumber = generateOrderPDF(cart, client);
            const { url } = formatWhatsAppMessage(cart, client, orderNumber);
            window.open(url, '_blank');
            setConfirmation({ orderNumber, pdfUrl: null, whatsappUrl: url });
            clearCart();
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setConfirmation(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-sm flex flex-col bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <ShoppingBag size={18} className="text-blue-600" />
                        Commande
                        {totalQty > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                                {totalQty}
                            </span>
                        )}
                    </div>
                    <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Écran de confirmation après envoi */}
                {confirmation ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                        <CheckCircle2 size={48} className="text-green-500" />
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Commande envoyée !</p>
                            <p className="text-sm text-slate-500 mt-1">
                                N° <span className="font-semibold text-slate-700">{confirmation.orderNumber}</span>
                            </p>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs">
                            Votre demande est enregistrée. Nous vous recontactons rapidement
                            pour confirmer disponibilité et délais.
                        </p>
                        <div className="w-full space-y-2 mt-2">
                            <a
                                href={confirmation.whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            >
                                <MessageCircle size={16} />
                                Renvoyer sur WhatsApp
                            </a>
                            {confirmation.pdfUrl && (
                                <a
                                    href={confirmation.pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full border border-gray-200 hover:bg-gray-50 text-slate-700 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    <FileDown size={16} />
                                    Télécharger le bon de commande (PDF)
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Produits */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 pt-20">
                                    <ShoppingBag size={40} className="text-slate-200" />
                                    <p className="text-sm">Aucun produit ajouté</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-3 py-2 border-b border-gray-50">
                                        <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.image_url || item.image || ''}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{item.name}</p>
                                            <p className="text-xs text-slate-400">{item.category}</p>
                                            {item.price ? (
                                                <p className="text-sm font-bold text-blue-600 mt-1">
                                                    {(parseFloat(item.price) * item.quantity).toLocaleString('fr-FR')} FCFA
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-400 mt-1">Sur devis</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pied — visible uniquement si panier non vide */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">

                                {/* Total */}
                                {total > 0 && (
                                    <div className="flex justify-between text-sm font-bold text-slate-800">
                                        <span>Total estimé</span>
                                        <span className="text-blue-600">{total.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                )}

                                {/* Formulaire client */}
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Votre nom (optionnel)"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                                />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Votre telephone *"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                                />

                                <button
                                    onClick={handleSend}
                                    disabled={!phone.trim() || sending}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                                    {sending ? 'Envoi en cours...' : 'Envoyer la commande'}
                                </button>
                                <p className="text-xs text-center text-slate-400">
                                    Commande enregistrée + envoi sur WhatsApp avec bon de commande PDF
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
