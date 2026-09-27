import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FINANCE_DATA } from '../data'
import './BudgetScreen.css'

export default function BudgetScreen() {
  const { groceries, addGrocery, toggleGrocery, pocketMoney } = useApp()
  const [showAddGrocery, setShowAddGrocery] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', category: 'Produce', price: '', quantity: 1 })
  const [activeTab, setActiveTab] = useState('overview')

  const budgetPercent = Math.round((FINANCE_DATA.spent / FINANCE_DATA.budget) * 100)
  const groceryTotal = groceries.filter(g => g.status === 'pending').reduce((sum, g) => sum + g.price * g.quantity, 0)

  const handleAddGrocery = () => {
    if (!newItem.name.trim()) return
    addGrocery({ ...newItem, price: parseFloat(newItem.price) || 0, addedBy: 'Sarah' })
    setNewItem({ name: '', category: 'Produce', price: '', quantity: 1 })
    setShowAddGrocery(false)
  }

  return (
    <div className="budget-screen animate-fade-in">
      <div className="budget-header">
        <h1>Budget Manager</h1>
        <p>Track expenses, groceries, and pocket money</p>
      </div>

      <div className="budget-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'groceries' ? 'active' : ''} onClick={() => setActiveTab('groceries')}>Groceries</button>
        <button className={activeTab === 'pocket' ? 'active' : ''} onClick={() => setActiveTab('pocket')}>Pocket Money</button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="budget-card glass">
            <div className="budget-main">
              <div className="budget-circle">
                <svg viewBox="0 0 100 100" className="budget-ring">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface3)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--teal)" strokeWidth="8" strokeDasharray={`${budgetPercent * 2.64} 264`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div className="budget-center">
                  <span className="budget-percent">{budgetPercent}%</span>
                  <span className="budget-label">Used</span>
                </div>
              </div>
              <div className="budget-details">
                <div className="budget-row"><span>Spent</span><strong>${FINANCE_DATA.spent.toLocaleString()}</strong></div>
                <div className="budget-row"><span>Budget</span><strong>${FINANCE_DATA.budget.toLocaleString()}</strong></div>
                <div className="budget-row"><span>Remaining</span><strong className="text-teal">${(FINANCE_DATA.budget - FINANCE_DATA.spent).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>

          <div className="categories-list">
            {FINANCE_DATA.categories.map((c, i) => (
              <div key={i} className="category-item glass">
                <div className="cat-header">
                  <span className="cat-dot" style={{ background: c.color }} />
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-amount">${c.amount}</span>
                </div>
                <div className="cat-bar">
                  <div className="cat-fill" style={{ width: `${Math.min((c.amount / c.budget) * 100, 100)}%`, background: c.color }} />
                </div>
                <span className="cat-budget">of ${c.budget} budget</span>
              </div>
            ))}
          </div>

          <div className="budget-insight glass">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="#14b8a6"/></svg>
            {FINANCE_DATA.insight}
          </div>
        </>
      )}

      {activeTab === 'groceries' && (
        <>
          <div className="grocery-summary glass">
            <div><span className="grocery-count">{groceries.filter(g => g.status === 'pending').length}</span><span>items pending</span></div>
            <div><span className="grocery-total">${groceryTotal.toFixed(2)}</span><span>estimated total</span></div>
            <button className="add-grocery-btn" onClick={() => setShowAddGrocery(true)}>+ Add</button>
          </div>
          <div className="grocery-list">
            {groceries.map(g => (
              <div key={g.id} className={`grocery-item glass ${g.status}`} onClick={() => toggleGrocery(g.id)}>
                <div className="grocery-check">{g.status === 'purchased' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#003731"/></svg>}</div>
                <div className="grocery-info">
                  <span className="grocery-name">{g.name}</span>
                  <span className="grocery-meta">{g.category} - Qty: {g.quantity} - Added by {g.addedBy}</span>
                </div>
                <span className="grocery-price">${(g.price * g.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'pocket' && (
        <>
          {pocketMoney.map((p, i) => (
            <div key={i} className="pocket-card glass">
              <div className="pocket-header">
                <div className="pocket-avatar">{p.member[0]}</div>
                <div>
                  <h3>{p.member}</h3>
                  <span>Weekly allowance: ${p.weekly}</span>
                </div>
              </div>
              <div className="pocket-stats">
                <div className="pocket-stat"><span>Spent</span><strong className="text-red">${p.spent.toFixed(2)}</strong></div>
                <div className="pocket-stat"><span>Remaining</span><strong className="text-teal">${(p.weekly - p.spent).toFixed(2)}</strong></div>
                <div className="pocket-stat"><span>Savings</span><strong className="text-green">${p.savings.toFixed(2)}</strong></div>
              </div>
              <div className="pocket-chores">
                <h4>Chores to earn</h4>
                {p.chores.map((c, j) => <span key={j} className="chore-chip">{c}</span>)}
              </div>
            </div>
          ))}
        </>
      )}

      {showAddGrocery && (
        <div className="modal-overlay" onClick={() => setShowAddGrocery(false)}>
          <div className="modal glass-strong" onClick={e => e.stopPropagation()}>
            <h3>Add Grocery Item</h3>
            <input type="text" placeholder="Item name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
              <option>Produce</option><option>Dairy</option><option>Meat</option><option>Bakery</option><option>Pantry</option><option>Frozen</option><option>Other</option>
            </select>
            <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
            <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })} />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowAddGrocery(false)}>Cancel</button>
              <button className="modal-save" onClick={handleAddGrocery}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
