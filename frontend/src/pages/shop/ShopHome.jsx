import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopHome.css';

const API = 'http://localhost:5000/api';

const CATEGORY_EMOJIS = {
  'saree': '🥻', 'churidar': '👗', 'churidars': '👗',
  'kids': '🎀', 'party': '💃', 'default': '👗'
};

function getEmoji(cat) {
  if (!cat) return '👗';
  const key = cat.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_EMOJIS)) {
    if (key.includes(k)) return v;
  }
  return '👗';
}

function Stars({ rating, size = '1rem' }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= rating ? '#c9972a' : 'rgba(201,151,42,0.2)' }}>★</span>
      ))}
    </div>
  );
}

export default function ShopHome() {
  const [settings, setSettings] = useState({});
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [reviewForm, setReviewForm] = useState({ customer_name: '', rating: 5, comment: '' });
  const [hoverStar, setHoverStar] = useState(0);
  const [reviewMsg, setReviewMsg] = useState('');
  const [enquiry, setEnquiry] = useState({ name: '', phone: '', dress_type: '', budget: '', message: '' });

  useEffect(() => {
    axios.get(`${API}/settings`).then(r => setSettings(r.data)).catch(() => {});
    axios.get(`${API}/products`).then(r => setProducts(r.data)).catch(() => {});
    axios.get(`${API}/reviews`).then(r => setReviews(r.data)).catch(() => {});
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '3.6';

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean).map(c => c.toUpperCase()))];
  const filteredProducts = activeFilter === 'ALL'
    ? products
    : products.filter(p => (p.category || '').toUpperCase() === activeFilter);

  const ratingCounts = [5,4,3,2,1].map(n => ({
    n, count: reviews.filter(r => r.rating === n).length
  }));
  const maxCount = Math.max(...ratingCounts.map(r => r.count), 1);

  const submitReview = async () => {
    if (!reviewForm.customer_name.trim()) { setReviewMsg('❌ பேரு சொல்லுங்க'); return; }
    try {
      await axios.post(`${API}/reviews`, reviewForm);
      setReviewMsg('✅ நன்றி! Admin approve பண்ணிய பிறகு show ஆகும்.');
      setReviewForm({ customer_name: '', rating: 5, comment: '' });
    } catch { setReviewMsg('❌ Error. Try again.'); }
  };

  const sendEnquiry = () => {
    const phone = (settings.shop_phone || '074483 67291').replace(/\D/g, '');
    const msg = `Hi! I'm interested in ordering from ${settings.shop_name || 'Agathiyar Store'}.\n\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nDress Type: ${enquiry.dress_type}\nBudget: ${enquiry.budget}\nMessage: ${enquiry.message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const displayReviews = reviews;

  return (
    <div className="shop-page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="nav-logo">
            <h1>{settings.shop_name || 'Agathiyar Store'}</h1>
            <p>Manachanallur · Est. Tiruchy</p>
          </div>
          <div className="nav-links">
            {[['collection','Collection'],['about','About'],['reviews','Reviews'],['order','Order']].map(([id, label]) => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>
          <div className="nav-right">
            <a href="/admin/login" className="nav-admin">⚙ Admin</a>
            <button className="nav-cart" onClick={() => scrollTo('order')}>🛒 Cart</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-pattern" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">✦ Manachanallur's Finest Dress Store</div>
            <h1 className="hero-title">
              Wear the<br /><em>Finest</em><br />Dresses
            </h1>
            <p className="hero-subtitle">Since generations, trusted by thousands</p>
            <p className="hero-desc">
              From vibrant Kanjivaram silk sarees to elegant churidars, stunning party wear and adorable kids outfits — all under one roof at honest prices.
            </p>
            <div className="hero-btns">
              <button className="btn-hero-gold" onClick={() => scrollTo('collection')}>✦ Explore Collection</button>
              <button className="btn-hero-outline" onClick={() => scrollTo('order')}>Order Now</button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">500<span>+</span></div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div>
                <div className="hero-stat-value">{avgRating}<span>★</span></div>
                <div className="hero-stat-label">Google Rating</div>
              </div>
              <div>
                <div className="hero-stat-value">10<span>+</span></div>
                <div className="hero-stat-label">Years of Trust</div>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-circle">
              <span className="hero-dress-emoji">🥻</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTION ── */}
      <section className="collection-section" id="collection">
        <div className="collection-inner">
          <div className="section-eyebrow">
            <div className="section-eyebrow-line" />
            <span className="section-eyebrow-text">Our Collection</span>
            <div className="section-eyebrow-line" />
          </div>
          <h2 className="section-title">Dresses for <em>Every Occasion</em></h2>
          <p className="section-subtitle">Handpicked fabrics, beautiful designs, honest prices — for women, men & children.</p>

          <div className="filter-tabs">
            {(categories.length > 1 ? categories : ['ALL','SAREES','CHURIDARS','KIDS WEAR','PARTY WEAR']).map(cat => (
              <button key={cat} className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}>
                {activeFilter === cat ? '✦ ' : ''}{cat}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {(filteredProducts.length > 0 ? filteredProducts : [
              { id:1, name:'Kanjivaram Silk Saree', category:'Saree', price:2499, stock:5, emoji:'🥻' },
              { id:2, name:'Cotton Daily Saree', category:'Saree', price:599, stock:10, emoji:'🪡' },
              { id:3, name:'Designer Churidar Set', category:'Churidar', price:899, stock:8, emoji:'👗' },
              { id:4, name:'Anarkali Kurti', category:'Churidar', price:749, stock:6, emoji:'🥻' },
              { id:5, name:'Kids Frock', category:'Kids', price:349, stock:12, emoji:'🎀' },
              { id:6, name:'Boys Ethnic Set', category:'Kids', price:449, stock:7, emoji:'🧒' },
              { id:7, name:'Party Wear Lehenga', category:'Party', price:1899, stock:3, emoji:'💃' },
              { id:8, name:'Evening Gown', category:'Party', price:1299, stock:4, emoji:'✨' },
            ]).map(p => (
              <div key={p.id} className="product-card">
                <div className="product-img">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    : <span style={{fontSize:'5rem'}}>{p.emoji || getEmoji(p.category)}</span>
                  }
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-cat">{p.category || 'Dress'}</div>
                  <div className="product-footer">
                    <div className="product-price">
                      <span>Rs.</span>{(p.price || 0).toLocaleString()}
                    </div>
                    {p.stock > 0
                      ? <button className="btn-add" onClick={() => scrollTo('order')}>+ ADD</button>
                      : <span className="out-of-stock-tag">Out of stock</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-visual">
            <div className="about-img-box">
              <span className="about-emoji">🪡</span>
              <div className="about-badge">
                <span>10+</span>
                <small>Years</small>
              </div>
            </div>
          </div>
          <div className="about-content">
            <p className="about-eyebrow">Our Story</p>
            <h2 className="about-title">Dressed in <em>Tradition,</em><br />Styled for Today</h2>
            <p className="about-text">
              Agathiyar Store has been the most trusted dress shop in Manachanallur for over a decade. We serve the people of Manachanallur, Ayyampalayam and surrounding villages with quality and care.
            </p>
            <p className="about-text">
              Our collection ranges from traditional Kanjivaram silk sarees and cotton daily wear to modern churidars, glamorous party wear and adorable kids outfits — all at fair prices.
            </p>
            <div className="about-features">
              {[
                { icon: '🧵', title: 'Quality Fabrics', desc: 'Handpicked from trusted weavers across Tamil Nadu' },
                { icon: '💰', title: 'Honest Prices', desc: 'Best value for every budget, no hidden costs' },
                { icon: '👨‍👩‍👧‍👦', title: 'All Ages', desc: 'For women, men, teens and children' },
                { icon: '🏆', title: '10+ Years Trust', desc: 'Serving Manachanallur since over a decade' },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-inner">
          <p className="reviews-eyebrow">Customer Voices</p>
          <h2 className="reviews-title">What People <em>Say</em></h2>

          <div className="reviews-summary">
            <div className="reviews-big-num">{avgRating}</div>
            <div className="reviews-right-summary">
              <div className="reviews-stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`rev-star ${s <= Math.round(parseFloat(avgRating)) ? '' : 'empty'}`}>★</span>
                ))}
              </div>
              <p className="reviews-count">Based on {displayReviews.length > 3 ? displayReviews.length : 5} Google Reviews</p>
              <div className="rating-bars">
                {ratingCounts.map(({ n, count }) => (
                  <div key={n} className="rating-bar-row">
                    <span className="bar-label">{n}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="bar-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reviews-grid">
            {displayReviews.map((r, i) => (
              <div key={r.id || i} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{r.customer_name[0].toUpperCase()}</div>
                  <div>
                    <div className="review-name">{r.customer_name}</div>
                    <div className="review-ago">{r.ago || r.created_at || 'Recently'}</div>
                  </div>
                </div>
                <div className="review-stars">
                  {[1,2,3,4,5].map(s => <span key={s} className={`r-star ${s <= r.rating ? '' : 'empty'}`}>★</span>)}
                </div>
                <p className="review-text">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDER / CONTACT ── */}
      <section className="order-section" id="order">
        <div className="order-inner">
          <div>
            <p className="order-eyebrow">Contact Us</p>
            <h2 className="order-title">Place Your <em>Order</em></h2>
            <p className="order-desc">Fill the form or reach us directly on WhatsApp! We'll confirm your order and arrange delivery or pickup at your convenience.</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">{settings.shop_address || 'C.Ayyampalayam, Manachanallur, TN 621005'}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Phone & WhatsApp</div>
                  <div className="contact-value">{settings.shop_phone || '074483 67291'}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div>
                  <div className="contact-label">Store Hours</div>
                  <div className="contact-value">Open Daily · Closes 9:30 PM</div>
                </div>
              </div>
            </div>
            <a href={`https://wa.me/${(settings.shop_phone || '07448367291').replace(/\D/g,'')}`}
              target="_blank" rel="noreferrer" className="btn-whatsapp">
              <span>💬</span> Chat on WhatsApp
            </a>
          </div>

          <div className="order-form-card">
            <h3 className="form-title">Enquiry Form ✦</h3>
            <div className="form-row">
              <div className="form-grp">
                <label>Your Name <span>*</span></label>
                <input className="form-input" placeholder="Full name" value={enquiry.name}
                  onChange={e => setEnquiry({...enquiry, name: e.target.value})} />
              </div>
              <div className="form-grp">
                <label>Phone <span>*</span></label>
                <input className="form-input" placeholder="Mobile number" value={enquiry.phone}
                  onChange={e => setEnquiry({...enquiry, phone: e.target.value})} />
              </div>
            </div>
            <div className="form-grp">
              <label>Dress Type <span>*</span></label>
              <select className="form-input" value={enquiry.dress_type}
                onChange={e => setEnquiry({...enquiry, dress_type: e.target.value})}>
                <option value="">Select a category</option>
                <option>Sarees</option>
                <option>Churidars</option>
                <option>Kids Wear</option>
                <option>Party Wear</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-grp">
              <label>Budget Range</label>
              <select className="form-input" value={enquiry.budget}
                onChange={e => setEnquiry({...enquiry, budget: e.target.value})}>
                <option value="">Select your budget</option>
                <option>Under ₹500</option>
                <option>₹500 – ₹1000</option>
                <option>₹1000 – ₹2000</option>
                <option>₹2000 – ₹5000</option>
                <option>Above ₹5000</option>
              </select>
            </div>
            <div className="form-grp">
              <label>Message</label>
              <textarea className="form-input form-textarea" placeholder="Tell us what you're looking for..."
                value={enquiry.message}
                onChange={e => setEnquiry({...enquiry, message: e.target.value})} />
            </div>
            <button className="btn-send-enquiry" onClick={sendEnquiry}>
              Send Enquiry via WhatsApp ✦
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <h2>{settings.shop_name || 'Agathiyar Store'}</h2>
              <p className="footer-brand-sub">Manachanallur's Finest</p>
              <p>Your most trusted dress store in Manachanallur. Quality fabrics, beautiful designs, honest prices since over a decade.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {[['collection','Collection'],['about','About Us'],['reviews','Reviews'],['order','Order Now']].map(([id, label]) => (
                  <li key={id}><button onClick={() => scrollTo(id)}>{label}</button></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-contact-list">
                <li><span className="fc-icon">📞</span>{settings.shop_phone || '074483 67291'}</li>
                <li><span className="fc-icon">📍</span>{settings.shop_address || 'C.Ayyampalayam, Manachanallur'}</li>
                <li><span className="fc-icon">🕐</span>Open till 9:30 PM daily</li>
                <li><span className="fc-icon">💬</span>WhatsApp Us</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 {settings.shop_name || 'Agathiyar Store'} · All rights reserved</p>
            <p className="footer-made">Made with ❤️ in Tamil Nadu 🌺</p>
          </div>
        </div>
      </footer>

      {/* ── WRITE REVIEW ── */}
      <section className="write-review-section">
        <div className="write-review-inner">
          <p className="wr-eyebrow">Share Your Experience</p>
          <h2 className="wr-title">Write a <em>Review</em></h2>
          <div className="wr-line" />
          <div className="wr-form">
            {reviewMsg && <div className="wr-alert">{reviewMsg}</div>}
            <div className="form-grp">
              <label>Your Name <span style={{color:'#c9972a'}}>*</span></label>
              <input className="form-input" placeholder="Your name" value={reviewForm.customer_name}
                onChange={e => setReviewForm({...reviewForm, customer_name: e.target.value})} />
            </div>
            <div className="form-grp">
              <label>Rating <span style={{color:'#c9972a'}}>*</span></label>
              <div className="star-pick">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`sp-star ${(hoverStar || reviewForm.rating) >= s ? 'active' : ''}`}
                    onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setReviewForm({...reviewForm, rating: s})}>★</span>
                ))}
              </div>
            </div>
            <div className="form-grp">
              <label>Review <span style={{color:'#c9972a'}}>*</span></label>
              <textarea className="form-input form-textarea" placeholder="Tell us about your experience..."
                value={reviewForm.comment}
                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
            </div>
            <button className="btn-send-enquiry" onClick={submitReview}>
              Submit Review ✦
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
