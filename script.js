// Mock Data
const mockTransactions = [
    { id: 1, name: 'Amazon Purchase', date: '2024-11-20', amount: -85.50, type: 'debit', category: 'Shopping' },
    { id: 2, name: 'Salary Deposit', date: '2024-11-18', amount: 5250.00, type: 'credit', category: 'Income' },
    { id: 3, name: 'Netflix Subscription', date: '2024-11-17', amount: -15.99, type: 'debit', category: 'Entertainment' },
    { id: 4, name: 'Grocery Store', date: '2024-11-16', amount: -142.30, type: 'debit', category: 'Food' },
    { id: 5, name: 'Freelance Payment', date: '2024-11-15', amount: 850.00, type: 'credit', category: 'Income' },
    { id: 6, name: 'Gas Station', date: '2024-11-14', amount: -52.75, type: 'debit', category: 'Transportation' },
    { id: 7, name: 'Restaurant', date: '2024-11-13', amount: -68.90, type: 'debit', category: 'Food' },
    { id: 8, name: 'ATM Withdrawal', date: '2024-11-12', amount: -200.00, type: 'debit', category: 'Cash' }
];

const userData = {
    name: 'John Doe',
    username: 'demo',
    accounts: {
        checking: 12458.50,
        savings: 45280.75,
        credit: 2340.00,
        loan: 185500.00
    }
};

// Login Functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in real app, this would be server-side)
        if (username === 'demo' && password === 'demo123') {
            // Store user session
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userName', userData.name);
            
            // Add loading animation
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Signing in...';
            submitBtn.style.opacity = '0.7';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alert('Invalid credentials! Please use demo/demo123');
        }
    });
}

// Dashboard Functionality
if (document.querySelector('.dashboard-body')) {
    // Check if user is logged in
    if (!localStorage.getItem('userLoggedIn')) {
        window.location.href = 'index.html';
    }
    
    // Set user name
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }
    
    // Load recent transactions
    loadRecentTransactions();
    
    // Load all transactions table
    loadTransactionsTable();
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.add('hidden'));
            
            // Show selected page
            const pageId = this.getAttribute('data-page') + '-page';
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.remove('hidden');
                
                // Update page title
                const pageTitles = {
                    'overview': 'Dashboard Overview',
                    'accounts': 'My Accounts',
                    'transactions': 'Transaction History',
                    'transfer': 'Transfer Money',
                    'loans': 'My Loans',
                    'bills': 'Pay Bills'
                };
                
                const pageTitle = this.getAttribute('data-page');
                document.getElementById('pageTitle').textContent = pageTitles[pageTitle];
            }
        });
    });
    
    // Quick actions
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action === 'transfer' || action === 'bills') {
                const navItem = document.querySelector(`[data-page="${action}"]`);
                if (navItem) {
                    navItem.click();
                }
            } else {
                showModal('Action', `${action} feature coming soon!`);
            }
        });
    });
    
    // Transfer form
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromAccount = document.getElementById('fromAccount').value;
            const toAccount = document.getElementById('toAccount').value;
            const amount = document.getElementById('transferAmount').value;
            const description = document.getElementById('transferDescription').value;
            
            if (fromAccount === toAccount) {
                alert('Please select different accounts for transfer');
                return;
            }
            
            // Simulate transfer
            showModal(
                'Transfer Successful!',
                `$${parseFloat(amount).toFixed(2)} has been transferred successfully.`
            );
            
            // Reset form
            this.reset();
        });
    }
    
    // Bill payment form
    const billForm = document.getElementById('billPaymentForm');
    if (billForm) {
        billForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const payee = document.getElementById('payee').value;
            const amount = document.getElementById('billAmount').value;
            
            showModal(
                'Payment Successful!',
                `Your bill payment of $${parseFloat(amount).toFixed(2)} to ${payee} has been processed.`
            );
            
            // Reset form
            this.reset();
        });
    }
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    });
    
    // Filters for transactions
    const accountFilter = document.getElementById('accountFilter');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (accountFilter) {
        accountFilter.addEventListener('change', loadTransactionsTable);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', loadTransactionsTable);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', loadTransactionsTable);
    }
}

// Load Recent Transactions
function loadRecentTransactions() {
    const container = document.getElementById('recentTransactionsList');
    if (!container) return;
    
    const recentTransactions = mockTransactions.slice(0, 5);
    
    container.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    ${transaction.type === 'debit' ? '↓' : '↑'}
                </div>
                <div class="transaction-details">
                    <h4>${transaction.name}</h4>
                    <p>${formatDate(transaction.date)}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Load Transactions Table
function loadTransactionsTable() {
    const container = document.getElementById('transactionsTable');
    if (!container) return;
    
    const accountFilter = document.getElementById('accountFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value;
    
    let filteredTransactions = mockTransactions;
    
    // Apply filters
    if (typeFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }
    
    if (dateFilter) {
        filteredTransactions = filteredTransactions.filter(t => t.date === dateFilter);
    }
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #718096;">No transactions found</div>';
        return;
    }
    
    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f7fafc; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Date</th>
                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Description</th>
                    <th style="padding: 1rem; text-align: left; font-weight: 600;">Category</th>
                    <th style="padding: 1rem; text-align: right; font-weight: 600;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTransactions.map(transaction => `
                    <tr style="border-bottom: 1px solid #e2e8f0; transition: all 0.3s ease;" 
                        onmouseover="this.style.background='#f7fafc'" 
                        onmouseout="this.style.background='white'">
                        <td style="padding: 1rem;">${formatDate(transaction.date)}</td>
                        <td style="padding: 1rem; font-weight: 600;">${transaction.name}</td>
                        <td style="padding: 1rem;"><span style="background: #e2e8f0; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">${transaction.category}</span></td>
                        <td style="padding: 1rem; text-align: right; font-weight: 700; color: ${transaction.type === 'debit' ? '#e53e3e' : '#38b2ac'};">
                            ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show Modal
function showModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('show');
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Close modal on background click
if (document.getElementById('successModal')) {
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Initialize date input with today's date
if (document.getElementById('billDate')) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;
}
