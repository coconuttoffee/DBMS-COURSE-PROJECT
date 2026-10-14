(function () {
  const STORAGE_KEY = 'siteLedgerDemoState';

  function addDays(date, amount) {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createSites() {
    return [
      { id: 'site-1', name: 'North Yard', location: 'Bristol Road' },
      { id: 'site-2', name: 'Harbour Tower', location: 'Dock Street' },
    ];
  }

  function createMaterials() {
    return [
      { id: 'mat-1', name: 'Cement bags', unit: 'bags', reorderLevel: 42, unitCost: 12 },
      { id: 'mat-2', name: 'Steel rods', unit: 'bars', reorderLevel: 26, unitCost: 28 },
      { id: 'mat-3', name: 'Sand', unit: 'tonnes', reorderLevel: 18, unitCost: 36 },
    ];
  }

  function createVendors() {
    return [
      { id: 'ven-1', name: 'Meridian Supply', contact: '01494 002110' },
      { id: 'ven-2', name: 'Bayside Building Group', contact: '01123 448777' },
      { id: 'ven-3', name: 'Ridge Materials Ltd', contact: '01729 781320' },
    ];
  }

  function createUsers() {
    return [
      { id: 'user-1', username: 'admin', role: 'Admin' },
      { id: 'user-2', username: 'site.manager', role: 'Site Manager' },
      { id: 'user-3', username: 'store.keeper', role: 'Store Keeper' },
      { id: 'user-4', username: 'viewer', role: 'Viewer' },
    ];
  }

  function createWorkers() {
    return [
      { id: 'worker-1', name: 'Amina Okafor', role: 'Site Manager', hourlyRate: 24 },
      { id: 'worker-2', name: 'Liam Ross', role: 'Carpenter', hourlyRate: 20 },
      { id: 'worker-3', name: 'Priya Shah', role: 'Plasterer', hourlyRate: 18 },
      { id: 'worker-4', name: 'David Kim', role: 'Mason', hourlyRate: 19 },
      { id: 'worker-5', name: 'Sofia Martins', role: 'Laborer', hourlyRate: 16 },
      { id: 'worker-6', name: 'Nathan Cole', role: 'Electrician', hourlyRate: 22 },
      { id: 'worker-7', name: 'Hannah Wu', role: 'Laborer', hourlyRate: 15 },
      { id: 'worker-8', name: 'Oliver Reed', role: 'Carpenter', hourlyRate: 20 },
      { id: 'worker-9', name: 'Marta Diaz', role: 'Bricklayer', hourlyRate: 18 },
      { id: 'worker-10', name: 'Kai Patel', role: 'Finisher', hourlyRate: 17 },
    ];
  }

  function createPurchaseOrders() {
    const vendorMap = { 'ven-1': 'Meridian Supply', 'ven-2': 'Bayside Building Group', 'ven-3': 'Ridge Materials Ltd' };
    const today = new Date();

    const sampleOrders = [
      {
        id: 'PO-1001',
        siteId: 'site-1',
        vendorId: 'ven-1',
        vendorName: vendorMap['ven-1'],
        orderDate: formatDateInput(addDays(today, -13)),
        status: 'Delivered',
        notes: 'Bulk cement for the first floor pour.',
        items: [
          { materialId: 'mat-1', quantity: 40 },
          { materialId: 'mat-3', quantity: 8 },
        ],
      },
      {
        id: 'PO-1002',
        siteId: 'site-2',
        vendorId: 'ven-2',
        vendorName: vendorMap['ven-2'],
        orderDate: formatDateInput(addDays(today, -11)),
        status: 'Delivered',
        notes: 'Steel delivery for structural work.',
        items: [
          { materialId: 'mat-2', quantity: 28 },
        ],
      },
      {
        id: 'PO-1003',
        siteId: 'site-1',
        vendorId: 'ven-3',
        vendorName: vendorMap['ven-3'],
        orderDate: formatDateInput(addDays(today, -9)),
        status: 'Approved',
        notes: 'Sand for levelling and rendering.',
        items: [
          { materialId: 'mat-3', quantity: 12 },
          { materialId: 'mat-1', quantity: 24 },
        ],
      },
      {
        id: 'PO-1004',
        siteId: 'site-2',
        vendorId: 'ven-1',
        vendorName: vendorMap['ven-1'],
        orderDate: formatDateInput(addDays(today, -8)),
        status: 'Open',
        notes: 'Follow-up order for finishing works.',
        items: [
          { materialId: 'mat-1', quantity: 16 },
          { materialId: 'mat-3', quantity: 7 },
        ],
      },
      {
        id: 'PO-1005',
        siteId: 'site-1',
        vendorId: 'ven-2',
        vendorName: vendorMap['ven-2'],
        orderDate: formatDateInput(addDays(today, -6)),
        status: 'Delivered',
        notes: 'Steel rods for stair core.',
        items: [
          { materialId: 'mat-2', quantity: 16 },
        ],
      },
      {
        id: 'PO-1006',
        siteId: 'site-2',
        vendorId: 'ven-3',
        vendorName: vendorMap['ven-3'],
        orderDate: formatDateInput(addDays(today, -5)),
        status: 'Approved',
        notes: 'Cement for the façade and cladding phases.',
        items: [
          { materialId: 'mat-1', quantity: 30 },
        ],
      },
      {
        id: 'PO-1007',
        siteId: 'site-1',
        vendorId: 'ven-1',
        vendorName: vendorMap['ven-1'],
        orderDate: formatDateInput(addDays(today, -2)),
        status: 'Open',
        notes: 'Short top-up order before the next inspection.',
        items: [
          { materialId: 'mat-3', quantity: 9 },
          { materialId: 'mat-2', quantity: 10 },
        ],
      },
      {
        id: 'PO-1008',
        siteId: 'site-2',
        vendorId: 'ven-2',
        vendorName: vendorMap['ven-2'],
        orderDate: formatDateInput(addDays(today, -1)),
        status: 'Delivered',
        notes: 'Cement and sand for the final concrete pour.',
        items: [
          { materialId: 'mat-1', quantity: 22 },
          { materialId: 'mat-3', quantity: 10 },
        ],
      },
    ];

    return sampleOrders;
  }

  function createTransactions() {
    const today = new Date();
    const transactions = [
      { id: 'txn-1', siteId: 'site-1', materialId: 'mat-1', type: 'IN', quantity: 120, date: formatDateInput(addDays(today, -14)), note: 'Opening stock' },
      { id: 'txn-2', siteId: 'site-1', materialId: 'mat-2', type: 'IN', quantity: 80, date: formatDateInput(addDays(today, -14)), note: 'Initial receipt' },
      { id: 'txn-3', siteId: 'site-1', materialId: 'mat-3', type: 'IN', quantity: 90, date: formatDateInput(addDays(today, -14)), note: 'Initial receipt' },
      { id: 'txn-4', siteId: 'site-2', materialId: 'mat-1', type: 'IN', quantity: 100, date: formatDateInput(addDays(today, -14)), note: 'Opening stock' },
      { id: 'txn-5', siteId: 'site-2', materialId: 'mat-2', type: 'IN', quantity: 85, date: formatDateInput(addDays(today, -14)), note: 'Initial receipt' },
      { id: 'txn-6', siteId: 'site-2', materialId: 'mat-3', type: 'IN', quantity: 96, date: formatDateInput(addDays(today, -14)), note: 'Opening stock' },
      { id: 'txn-7', siteId: 'site-1', materialId: 'mat-1', type: 'OUT', quantity: 18, date: formatDateInput(addDays(today, -13)), note: 'Wall blockwork' },
      { id: 'txn-8', siteId: 'site-1', materialId: 'mat-3', type: 'OUT', quantity: 12, date: formatDateInput(addDays(today, -12)), note: 'Render prep' },
      { id: 'txn-9', siteId: 'site-2', materialId: 'mat-2', type: 'OUT', quantity: 15, date: formatDateInput(addDays(today, -11)), note: 'Structural frames' },
      { id: 'txn-10', siteId: 'site-1', materialId: 'mat-1', type: 'IN', quantity: 40, date: formatDateInput(addDays(today, -10)), note: 'PO-1001 received' },
      { id: 'txn-11', siteId: 'site-2', materialId: 'mat-2', type: 'IN', quantity: 28, date: formatDateInput(addDays(today, -10)), note: 'PO-1002 received' },
      { id: 'txn-12', siteId: 'site-1', materialId: 'mat-3', type: 'IN', quantity: 8, date: formatDateInput(addDays(today, -9)), note: 'PO-1001 received' },
      { id: 'txn-13', siteId: 'site-1', materialId: 'mat-1', type: 'OUT', quantity: 14, date: formatDateInput(addDays(today, -9)), note: 'Beam formwork' },
      { id: 'txn-14', siteId: 'site-1', materialId: 'mat-2', type: 'OUT', quantity: 10, date: formatDateInput(addDays(today, -8)), note: 'Lintel installation' },
      { id: 'txn-15', siteId: 'site-2', materialId: 'mat-3', type: 'OUT', quantity: 9, date: formatDateInput(addDays(today, -7)), note: 'Leveling fill' },
      { id: 'txn-16', siteId: 'site-1', materialId: 'mat-2', type: 'IN', quantity: 16, date: formatDateInput(addDays(today, -6)), note: 'PO-1005 received' },
      { id: 'txn-17', siteId: 'site-2', materialId: 'mat-1', type: 'OUT', quantity: 16, date: formatDateInput(addDays(today, -5)), note: 'Facade slab work' },
      { id: 'txn-18', siteId: 'site-2', materialId: 'mat-1', type: 'IN', quantity: 30, date: formatDateInput(addDays(today, -4)), note: 'PO-1006 received' },
      { id: 'txn-19', siteId: 'site-1', materialId: 'mat-3', type: 'OUT', quantity: 11, date: formatDateInput(addDays(today, -4)), note: 'Plaster prep' },
      { id: 'txn-20', siteId: 'site-2', materialId: 'mat-3', type: 'IN', quantity: 10, date: formatDateInput(addDays(today, -3)), note: 'PO-1008 received' },
      { id: 'txn-21', siteId: 'site-1', materialId: 'mat-2', type: 'OUT', quantity: 7, date: formatDateInput(addDays(today, -3)), note: 'Steel fixing' },
      { id: 'txn-22', siteId: 'site-2', materialId: 'mat-1', type: 'OUT', quantity: 8, date: formatDateInput(addDays(today, -2)), note: 'Concrete pour' },
      { id: 'txn-23', siteId: 'site-1', materialId: 'mat-3', type: 'IN', quantity: 9, date: formatDateInput(addDays(today, -2)), note: 'PO-1007 received' },
      { id: 'txn-24', siteId: 'site-2', materialId: 'mat-2', type: 'OUT', quantity: 6, date: formatDateInput(addDays(today, -1)), note: 'Balcony support' },
      { id: 'txn-25', siteId: 'site-1', materialId: 'mat-1', type: 'OUT', quantity: 12, date: formatDateInput(addDays(today, -1)), note: 'Wall finishing' },
    ];

    return transactions;
  }

  function createAttendance() {
    const today = new Date();
    const workers = createWorkers();
    const statusCycle = ['Present', 'Present', 'Half-day', 'Present', 'Absent', 'Present', 'Present'];
    const attendance = [];

    for (let dayOffset = 13; dayOffset >= 0; dayOffset -= 1) {
      workers.forEach((worker, index) => {
        const date = formatDateInput(addDays(today, -dayOffset));
        const status = statusCycle[(index + dayOffset) % statusCycle.length];
        attendance.push({ id: `att-${worker.id}-${date}`, workerId: worker.id, date, status });
      });
    }

    return attendance;
  }

  function buildState() {
    return {
      sites: createSites(),
      materials: createMaterials(),
      vendors: createVendors(),
      workers: createWorkers(),
      users: createUsers(),
      purchaseOrders: createPurchaseOrders(),
      transactions: createTransactions(),
      attendance: createAttendance(),
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const state = buildState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return state;
      }

      const parsed = JSON.parse(saved);
      if (!parsed || !Array.isArray(parsed.purchaseOrders) || !Array.isArray(parsed.transactions)) {
        const state = buildState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return state;
      }

      return parsed;
    } catch (error) {
      const state = buildState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetState() {
    const state = buildState();
    saveState(state);
    return state;
  }

  window.SiteLedgerDemo = window.SiteLedgerDemo || {};
  window.SiteLedgerDemo.STORAGE_KEY = STORAGE_KEY;
  window.SiteLedgerDemo.buildState = buildState;
  window.SiteLedgerDemo.loadState = loadState;
  window.SiteLedgerDemo.saveState = saveState;
  window.SiteLedgerDemo.resetState = resetState;
  window.SiteLedgerDemo.formatDateInput = formatDateInput;
})();
