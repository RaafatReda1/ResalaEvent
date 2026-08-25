import React, { useState, useEffect } from 'react';
import { Search, Package, User, ShoppingCart, Truck, ExternalLink, History, Tags, Mail, LayoutDashboard, PieChart, Settings, Boxes, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../../utils/SupabaseClient';
import { useOrdersStore } from '../../../Orders/store/useOrdersStore';
import { useOrdersQuery } from '../../../Orders/hooks/useOrdersQuery';
import styles from './SearchBar.module.css';

// Admin Panel Static Pages for Search
const ADMIN_PAGES = [
    { id: 'page-dashboard', title: 'Dashboard', sub: 'Overview & Analytics', path: '/admin', icon: LayoutDashboard },
    { id: 'page-products', title: 'Products', sub: 'Manage Inventory', path: '/admin/products', icon: ShoppingBag },
    { id: 'page-catalogs', title: 'Catalogs', sub: 'Manage Categories & Brands', path: '/admin/catalogs', icon: Boxes },
    { id: 'page-orders', title: 'Orders', sub: 'Fulfillment & Returns', path: '/admin/orders', icon: Truck },
    { id: 'page-marketing', title: 'Marketing', sub: 'Promo Codes & Banners', path: '/admin/marketing', icon: PieChart },
    { id: 'page-messages', title: 'Messages', sub: 'Client Communications', path: '/admin/messages', icon: Mail },
    { id: 'page-cms', title: 'Store Identity', sub: 'CMS & Settings', path: '/admin/cms', icon: Settings },
];

// Highlight utility
const HighlightText = ({ text, query }) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) => 
                part.toLowerCase() === query.toLowerCase() 
                    ? <mark key={i} style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
                    : part
            )}
        </span>
    );
};

const SearchBar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { setView, setActiveOrder, setFilter } = useOrdersStore();
    const { rawOrders } = useOrdersQuery();
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ pages: [], products: [], categories: [], clients: [], orders: [], carts: [], messages: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const cleanQuery = query.trim().toLowerCase();
            if (!cleanQuery) {
                setResults({ pages: [], products: [], categories: [], clients: [], orders: [], carts: [], messages: [] });
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                // 0. Static Pages Match
                const pagesMatch = ADMIN_PAGES.filter(p => 
                    p.title.toLowerCase().includes(cleanQuery) || 
                    p.sub.toLowerCase().includes(cleanQuery)
                );

                // 1. Smart Local Search (Orders)
                const localOrders = rawOrders.filter(o => 
                    o.id.toLowerCase().includes(cleanQuery) || 
                    o.full_name?.toLowerCase().includes(cleanQuery) ||
                    o.phone_number?.includes(cleanQuery)
                ).slice(0, 3);

                // 2. Global Cloud Search
                const [prodRes, catRes, clientRes, cartRes, msgRes] = await Promise.all([
                    supabase.from('Products').select('id, nameEn, nameAr').or(`nameEn.ilike.%${cleanQuery}%,nameAr.ilike.%${cleanQuery}%,id.ilike.%${cleanQuery}%`).limit(3),
                    supabase.from('Categories').select('id, nameEn, nameAr').or(`nameEn.ilike.%${cleanQuery}%,nameAr.ilike.%${cleanQuery}%,id.ilike.%${cleanQuery}%`).limit(2),
                    supabase.from('Clients').select('id, email, fullName, phone').or(`fullName.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%,phone.ilike.%${cleanQuery}%`).limit(3),
                    supabase.from('Carts').select('id, client_id').ilike('id', `%${cleanQuery}%`).limit(2),
                    supabase.from('contact_messages').select('id, name, subject, message').or(`name.ilike.%${cleanQuery}%,subject.ilike.%${cleanQuery}%,message.ilike.%${cleanQuery}%`).limit(2)
                ]);

                setResults({
                    pages: pagesMatch,
                    products: prodRes.data || [],
                    categories: catRes.data || [],
                    clients: clientRes.data || [],
                    orders: localOrders,
                    carts: cartRes.data || [],
                    messages: msgRes.data || []
                });
            } catch (err) {
                console.error("Omni-Search Error:", err);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, rawOrders]);

    const handleNavigate = (type, item) => {
        setShowDropdown(false);
        setQuery('');

        switch (type) {
            case 'page':
                navigate(item.path);
                break;
            case 'order':
                navigate('/admin/orders');
                setActiveOrder(item.id);
                setView('detail');
                break;
            case 'cart':
                navigate('/admin/orders');
                setView('carts');
                setFilter('search', item.id);
                break;
            case 'client':
                navigate('/admin/orders');
                setView('carts');
                setFilter('search', item.fullName || item.email);
                break;
            case 'product':
                navigate(`/admin/products?search=${item.id}`);
                break;
            case 'category':
                navigate(`/admin/catalogs`); // Needs client-side filter logic later
                break;
            case 'message':
                navigate(`/admin/messages`); // Ideally we'd open the specific message, but routing to the page is fine for now
                break;
            default: break;
        }
    };

    const ResultItem = ({ icon: Icon, title, sub, onClick, typeLabel, typeColor = '#0284c7', typeBg = '#e0f2fe' }) => (
        <div className={styles.resultItem} onClick={onClick}>
            <div className={styles.itemIcon}><Icon size={16} /></div>
            <div className={styles.itemInfo}>
                <p className={styles.itemTitle}><HighlightText text={title} query={query.trim()} /></p>
                <p className={styles.itemSub}><HighlightText text={sub} query={query.trim()} /></p>
            </div>
            {typeLabel && (
                <span className={styles.typeTag} style={{ color: typeColor, background: typeBg }}>
                    {typeLabel}
                </span>
            )}
            <ExternalLink size={12} className={styles.linkIcon} />
        </div>
    );

    const hasResults = Object.values(results).some(arr => arr.length > 0);

    return (
        <div className={styles.searchContainer}>
            <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                    type="text" 
                    placeholder={t('admin.search.placeholder', 'Search Pages, Orders, Users, Products...')} 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                    onFocus={() => query.trim() && setShowDropdown(true)}
                />
                {isSearching && <div className={styles.spinner}></div>}
            </div>

            {showDropdown && (
                <div className={styles.dropdown}>
                    {!isSearching && !hasResults ? (
                        <div className={styles.noResults}>{t('admin.search.no_results', 'No matches found')}</div>
                    ) : (
                        <div className={styles.resultsList}>
                            {/* Pages */}
                            {results.pages.map(p => (
                                <ResultItem key={p.id} icon={p.icon} title={p.title} sub={p.sub} onClick={() => handleNavigate('page', p)} typeLabel="PAGE" typeColor="#6366f1" typeBg="#e0e7ff" />
                            ))}
                            {/* Orders */}
                            {results.orders.map(o => (
                                <ResultItem key={o.id} icon={Truck} title={o.full_name} sub={`#...${o.id.slice(-8)}`} onClick={() => handleNavigate('order', o)} typeLabel="ORDER" typeColor="#16a34a" typeBg="#dcfce7" />
                            ))}
                            {/* Messages */}
                            {results.messages.map(m => (
                                <ResultItem key={m.id} icon={Mail} title={m.name} sub={m.subject} onClick={() => handleNavigate('message', m)} typeLabel="MESSAGE" typeColor="#ea580c" typeBg="#ffedd5" />
                            ))}
                            {/* Products */}
                            {results.products.map(p => (
                                <ResultItem key={p.id} icon={Package} title={i18n.language === 'ar' ? p.nameAr : p.nameEn} sub={`ID: ${p.id.slice(0,8)}`} onClick={() => handleNavigate('product', p)} typeLabel="PRODUCT" />
                            ))}
                            {/* Categories */}
                            {results.categories.map(c => (
                                <ResultItem key={c.id} icon={Tags} title={i18n.language === 'ar' ? c.nameAr : c.nameEn} sub={`Category ID: ${c.id.slice(0,8)}`} onClick={() => handleNavigate('category', c)} typeLabel="CATEGORY" typeColor="#9333ea" typeBg="#f3e8ff" />
                            ))}
                            {/* Users */}
                            {results.clients.map(c => (
                                <ResultItem key={c.id} icon={User} title={c.fullName} sub={c.email || c.phone} onClick={() => handleNavigate('client', c)} typeLabel="USER" typeColor="#4f46e5" typeBg="#e0e7ff" />
                            ))}
                            {/* Carts */}
                            {results.carts.map(c => (
                                <ResultItem key={c.id} icon={History} title={`Cart #${c.id.slice(0,8)}`} sub="Abandoned Session" onClick={() => handleNavigate('cart', c)} typeLabel="CART" typeColor="#64748b" typeBg="#f1f5f9" />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
