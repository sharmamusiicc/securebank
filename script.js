function initializeData() {
    // Check if data exists in localStorage
    const savedTransactions = localStorage.getItem('bankTransactions');
    const savedAccounts = localStorage.getItem('bankAccounts');
    
    if (savedTransactions) {
        return {
            transactions: JSON.parse(savedTransactions),
            accounts: JSON.parse(savedAccounts)
        };
    }
    
    // Default data if nothing in localStorage
    return {
        transactions: [
            { id: 1, name: 'Amazon Purchase', date: '2024-11-20', amount: -85.50, type: 'debit', category: 'Shopping', account: 'checking' },
            { id: 2, name: 'Salary Deposit', date: '2024-11-18', amount: 5250.00, type: 'credit', category: 'Income', account: 'checking' },
            { id: 3, name: 'Netflix Subscription', date: '2024-11-17', amount: -15.99, type: 'debit', category: 'Entertainment', account: 'checking' },
            { id: 4, name: 'Grocery Store', date: '2024-11-16', amount: -142.30, type: 'debit', category: 'Food', account: 'checking' },
            { id: 5, name: 'Freelance Payment', date: '2024-11-15', amount: 850.00, type: 'credit', category: 'Income', account: 'savings' },
            { id: 6, name: 'Gas Station', date: '2024-11-14', amount: -52.75, type: 'debit', category: 'Transportation', account: 'checking' },
            { id: 7, name: 'Restaurant', date: '2024-11-13', amount: -68.90, type: 'debit', category: 'Food', account: 'checking' },
            { id: 8, name: 'ATM Withdrawal', date: '2024-11-12', amount: -200.00, type: 'debit', category: 'Cash', account: 'checking' }
        ],
        accounts: {
            checking: 12458.50,
            savings: 45280.75,
            credit: 2340.00,
            loan: 185500.00
        }
    };
}

// Global data
let mockTransactions = [];
let accountBalances = {};

// Initialize on page load
const initialData = initializeData();
mockTransactions = initialData.transactions;
accountBalances = initialData.accounts;

// User profile data
function getUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        return JSON.parse(savedProfile);
    }
    
    // Default profile
    return {
        username: 'demo',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'Toronto',
        state: 'ON',
        zipCode: 'M5H 2N2',
        country: 'Canada'
    };
}

let userProfile = getUserProfile();

// Save user profile
function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Get full name
function getFullName() {
    return `${userProfile.firstName} ${userProfile.lastName}`;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('bankTransactions', JSON.stringify(mockTransactions));
    localStorage.setItem('bankAccounts', JSON.stringify(accountBalances));
}

// Add new transaction
function addTransaction(name, amount, type, category, account) {
    const newTransaction = {
        id: mockTransactions.length + 1,
        name: name,
        date: new Date().toISOString().split('T')[0],
        amount: amount,
        type: type,
        category: category,
        account: account
    };
    
    // Add to beginning of array (most recent first)
    mockTransactions.unshift(newTransaction);
    
    // Save to localStorage
    saveData();
    
    return newTransaction;
}

// Update account balance
function updateAccountBalance(account, amount) {
    if (accountBalances[account] !== undefined) {
        accountBalances[account] += amount;
        saveData();
        return true;
    }
    return false;
}
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
    const fullName = getFullName();
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = fullName;
    });
    
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
                    'bills': 'Pay Bills',
                    'profile': 'My Profile'
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
            const amount = parseFloat(document.getElementById('transferAmount').value);
            const description = document.getElementById('transferDescription').value || 'Transfer';
            
            if (fromAccount === toAccount) {
                alert('Please select different accounts for transfer');
                return;
            }
            
            // Simulate transfer
             if (!fromAccount || !toAccount) {
                alert('Please select both accounts');
                return;
            }
            
            // Check if sufficient balance
            if (accountBalances[fromAccount] < amount) {
                alert('Insufficient balance in source account!');
                return;
            }
            
            // Update account balances
            updateAccountBalance(fromAccount, -amount);
            updateAccountBalance(toAccount, amount);
            
            // Add debit transaction for source account
            const fromAccountName = getAccountName(fromAccount);
            addTransaction(
                `Transfer to ${getAccountName(toAccount)} - ${description}`,
                -amount,
                'debit',
                'Transfer',
                fromAccount
            );
            
            // Add credit transaction for destination account
            addTransaction(
                `Transfer from ${fromAccountName} - ${description}`,
                amount,
                'credit',
                'Transfer',
                toAccount
            );
            
            // Reload recent transactions and update account cards
            loadRecentTransactions();
            loadTransactionsTable();
            updateAccountCards();
            showModal(
                'Transfer Successful!',
                `$${amount.toFixed(2)} has been transferred from ${fromAccountName} to ${getAccountName(toAccount)}.`
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
            const fromAccount = document.getElementById('billFromAccount').value;
            const amount = parseFloat(document.getElementById('billAmount').value);
            const accountNumber = document.getElementById('billAccountNumber').value;
            
            if (!fromAccount) {
                alert('Please select an account');
                return;
            }
            
            // Check if sufficient balance
            if (accountBalances[fromAccount] < amount) {
                alert('Insufficient balance!');
                return;
            }
            
            // Update account balance
            updateAccountBalance(fromAccount, -amount);
            
            // Add transaction
            const payeeName = document.getElementById('payee').options[document.getElementById('payee').selectedIndex].text;
            addTransaction(
                `Bill Payment - ${payeeName}`,
                -amount,
                'debit',
                'Bills',
                fromAccount
            );
            
            // Reload data
            loadRecentTransactions();
            loadTransactionsTable();
            updateAccountCards();
            
            showModal(
                'Payment Successful!',
                `Your bill payment of $${amount.toFixed(2)} to ${payeeName} has been processed.`
            );
            
            // Reset form
            this.reset();
        });
    }
   
    // Update bill payment account options
    const billFromAccountSelect = document.getElementById('billFromAccount');
    if (billFromAccountSelect) {
        billFromAccountSelect.innerHTML = `
            <option value=\"\">Select Account</option>
            <option value=\"checking\">Checking (**** 4532) - $${accountBalances.checking.toFixed(2)}</option>
            <option value=\"savings\">Savings (**** 8721) - $${accountBalances.savings.toFixed(2)}</option>
        `;
    }
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    });

        // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        // Load profile data
        loadProfileData();
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update profile
            userProfile.firstName = document.getElementById('profileFirstName').value;
            userProfile.lastName = document.getElementById('profileLastName').value;
            userProfile.email = document.getElementById('profileEmail').value;
            userProfile.phone = document.getElementById('profilePhone').value;
            userProfile.address = document.getElementById('profileAddress').value;
            userProfile.city = document.getElementById('profileCity').value;
            userProfile.state = document.getElementById('profileState').value;
            userProfile.zipCode = document.getElementById('profileZip').value;
            userProfile.country = document.getElementById('profileCountry').value;
            
            saveUserProfile();
            
            // Update name display throughout the app
            const fullName = getFullName();
            document.querySelectorAll('#userName').forEach(el => {
                el.textContent = fullName;
            });
            
            showModal('Profile Updated!', 'Your profile information has been saved successfully.');
        });
    }
    
    // Loan payment form
    const loanPaymentForm = document.getElementById('loanPaymentForm');
    if (loanPaymentForm) {
        loanPaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('loanPaymentAmount').value);
            const fromAccount = document.getElementById('loanFromAccount').value;
            const loanType = document.getElementById('loanPaymentForm').dataset.loanType;
            
            if (!fromAccount) {
                alert('Please select an account');
                return;
            }
            
            // Check balance
            if (accountBalances[fromAccount] < amount) {
                alert('Insufficient balance!');
                return;
            }
            
            // Update account balance
            updateAccountBalance(fromAccount, -amount);
            
            // Update loan balance
            if (loanType === 'home') {
                accountBalances.loan -= amount;
            } else if (loanType === 'auto') {
                if (!accountBalances.autoLoan) {
                    accountBalances.autoLoan = 22450.00;
                }
                accountBalances.autoLoan -= amount;
            }
            
            saveData();
            
            // Add transaction
            const loanName = loanType === 'home' ? 'Home Loan' : 'Auto Loan';
            addTransaction(
                `${loanName} Payment`,
                -amount,
                'debit',
                'Loan Payment',
                fromAccount
            );
            
            // Update displays
            updateLoanDisplays();
            updateAccountCards();
            loadRecentTransactions();
            loadTransactionsTable();
            
            closeLoanModal();
            
            showModal(
                'Payment Successful!',
                `Your ${loanName} payment of $${amount.toFixed(2)} has been processed.`
            );
        });
    }
    // Add reset data functionality (for demo purposes)
    // You can add a button in the UI if you want users to reset to default data
    window.resetBankData = function() {
        if (confirm('This will reset all account balances and transactions to default values. Continue?')) {
            localStorage.removeItem('bankTransactions');
            localStorage.removeItem('bankAccounts');
            localStorage.removeItem('userProfile');
            location.reload();
        }
    };
    
    // Initial load of account cards
    updateAccountCards();
    updateLoanDisplays();
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

// Update account cards with current balances
function updateAccountCards() {
    // Update checking account
    const checkingBalance = document.querySelector('.checking-card .balance-amount');
    if (checkingBalance) {
        checkingBalance.textContent = `$${accountBalances.checking.toFixed(2)}`;
    }
    
    // Update savings account
    const savingsBalance = document.querySelector('.savings-card .balance-amount');
    if (savingsBalance) {
        savingsBalance.textContent = `$${accountBalances.savings.toFixed(2)}`;
    }
    
    // Update credit card
    const creditBalance = document.querySelector('.credit-card .balance-amount');
    if (creditBalance) {
        creditBalance.textContent = `$${accountBalances.credit.toFixed(2)}`;
    }
    
    // Update loan
    const loanBalance = document.querySelector('.loan-card .balance-amount');
    if (loanBalance) {
        loanBalance.textContent = `$${accountBalances.loan.toFixed(2)}`;
    }
        
    // Update account details page
    const checkingAccountBalance = document.getElementById('checkingAccountBalance');
    if (checkingAccountBalance) {
        checkingAccountBalance.textContent = `$${accountBalances.checking.toFixed(2)}`;
    }
    
    const savingsAccountBalance = document.getElementById('savingsAccountBalance');
    if (savingsAccountBalance) {
        savingsAccountBalance.textContent = `$${accountBalances.savings.toFixed(2)}`;
    }
    
    // Update transfer form options with current balances
    updateTransferOptions();
}

// Update transfer form dropdowns with current balances
function updateTransferOptions() {
    const fromAccountSelect = document.getElementById('fromAccount');
    const toAccountSelect = document.getElementById('toAccount');
    
    if (fromAccountSelect) {
        fromAccountSelect.innerHTML = `
            <option value=\"\">Select Account</option>
            <option value=\"checking\">Checking (**** 4532) - $${accountBalances.checking.toFixed(2)}</option>
            <option value=\"savings\">Savings (**** 8721) - $${accountBalances.savings.toFixed(2)}</option>
        `;
    }
    
    if (toAccountSelect) {
        toAccountSelect.innerHTML = `
            <option value=\"\">Select Account</option>
            <option value=\"checking\">Checking (**** 4532)</option>
            <option value=\"savings\">Savings (**** 8721)</option>
            <option value=\"external\">External Account</option>
        `;
    }
}

// Get account display name
function getAccountName(accountKey) {
    const names = {
        'checking': 'Checking Account',
        'savings': 'Savings Account',
        'credit': 'Credit Card',
        'loan': 'Loan Account',
        'external': 'External Account'
    };
    return names[accountKey] || accountKey;
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

// Load profile data into form
function loadProfileData() {
    if (document.getElementById('profileFirstName')) {
        document.getElementById('profileFirstName').value = userProfile.firstName;
        document.getElementById('profileLastName').value = userProfile.lastName;
        document.getElementById('profileEmail').value = userProfile.email;
        document.getElementById('profilePhone').value = userProfile.phone;
        document.getElementById('profileAddress').value = userProfile.address;
        document.getElementById('profileCity').value = userProfile.city;
        document.getElementById('profileState').value = userProfile.state;
        document.getElementById('profileZip').value = userProfile.zipCode;
        document.getElementById('profileCountry').value = userProfile.country;
    }
}

// Open loan payment modal
function openLoanPaymentModal(loanType) {
    const modal = document.getElementById('loanPaymentModal');
    const form = document.getElementById('loanPaymentForm');
    const title = document.getElementById('loanModalTitle');
    const minPayment = document.getElementById('loanMinPayment');
    
    form.dataset.loanType = loanType;
    
    if (loanType === 'home') {
        title.textContent = 'Make Home Loan Payment';
        minPayment.textContent = 'Minimum payment: $1,850.00';
    } else {
        title.textContent = 'Make Auto Loan Payment';
        minPayment.textContent = 'Minimum payment: $650.00';
    }
    
    // Update account options with current balances
    const loanFromAccount = document.getElementById('loanFromAccount');
    loanFromAccount.innerHTML = `
        <option value=\"\">Select Account</option>
        <option value=\"checking\">Checking (**** 4532) - $${accountBalances.checking.toFixed(2)}</option>
        <option value=\"savings\">Savings (**** 8721) - $${accountBalances.savings.toFixed(2)}</option>
    `;
    
    modal.classList.add('show');
}

// Close loan payment modal
function closeLoanModal() {
    const modal = document.getElementById('loanPaymentModal');
    const form = document.getElementById('loanPaymentForm');
    modal.classList.remove('show');
    form.reset();
}

// Update loan displays
function updateLoanDisplays() {
    // Initialize auto loan if not exists
    if (!accountBalances.autoLoan) {
        accountBalances.autoLoan = 22450.00;
    }
    
    // Home loan
    const homeLoanBalance = document.getElementById('homeLoanBalance');
    if (homeLoanBalance) {
        const balance = accountBalances.loan || 185500;
        homeLoanBalance.textContent = `$${balance.toFixed(2)}`;
        
        // Update progress
        const originalAmount = 250000;
        const paidAmount = originalAmount - balance;
        const percentPaid = (paidAmount / originalAmount * 100).toFixed(0);
        
        const progressBar = document.getElementById('homeLoanProgress');
        const progressText = document.getElementById('homeLoanPercent');
        
        if (progressBar) {
            progressBar.style.width = percentPaid + '%';
        }
        if (progressText) {
            progressText.textContent = percentPaid + '% Paid';
        }
    }
    
    // Auto loan
    const autoLoanBalance = document.getElementById('autoLoanBalance');
    if (autoLoanBalance) {
        const balance = accountBalances.autoLoan || 22450;
        autoLoanBalance.textContent = `$${balance.toFixed(2)}`;
        
        // Update progress
        const originalAmount = 35000;
        const paidAmount = originalAmount - balance;
        const percentPaid = (paidAmount / originalAmount * 100).toFixed(0);
        
        const progressBar = document.getElementById('autoLoanProgress');
        const progressText = document.getElementById('autoLoanPercent');
        
        if (progressBar) {
            progressBar.style.width = percentPaid + '%';
        }
        if (progressText) {
            progressText.textContent = percentPaid + '% Paid';
        }
    }
}

// Close loan modal on background click
if (document.getElementById('loanPaymentModal')) {
    document.getElementById('loanPaymentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoanModal();
        }
    });
}
