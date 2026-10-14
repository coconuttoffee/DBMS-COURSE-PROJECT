document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('stockTableBody')) {
    return;
  }

  const app = window.SiteLedgerDemo;
  let state = app.loadState();

  const stockSiteFilter = document.getElementById('stockSiteFilter');
  const stockMaterialFilter = document.getElementById('stockMaterialFilter');
  const purchaseOrderForm = document.getElementById('purchaseOrderForm');
  const purchaseOrdersTableBody = document.getElementById('purchaseOrdersTableBody');
  const attendanceDateInput = document.getElementById('attendanceDate');
  const attendanceTableBody = document.getElementById('attendanceTableBody');
  const payStartDate = document.getElementById('payStartDate');
  const payEndDate = document.getElementById('payEndDate');
  const resetDemoButton = document.getElementById('resetDemoButton');
  const usageDialog = document.getElementById('usageDialog');
  const usageForm = document.getElementById('usageForm');
  const poItemsContainer = document.getElementById('poItemsContainer');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timerId);
    showToast.timerId = window.setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  function getDateValue(dateString) {
    return dateString ? new Date(`${dateString}T00:00:00`) : new Date();
  }

  function formatDate(dateString) {
    if (!dateString) {
      return '—';
    }
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function getMaterialById(materialId) {
    return state.materials.find((material) => material.id === materialId) || null;
  }

  function getSiteById(siteId) {
    return state.sites.find((site) => site.id === siteId) || null;
  }

  function getVendorById(vendorId) {
    return state.vendors.find((vendor) => vendor.id === vendorId) || null;
  }

  function getWorkerById(workerId) {
    return state.workers.find((worker) => worker.id === workerId) || null;
  }

  function getCurrentBalance(siteId, materialId) {
    return state.transactions.reduce((total, transaction) => {
      if (transaction.siteId === siteId && transaction.materialId === materialId) {
        return total + (transaction.type === 'IN' ? Number(transaction.quantity) : -Number(transaction.quantity));
      }
      return total;
    }, 0);
  }

  function getMaterialStatus(siteId, materialId) {
    const material = getMaterialById(materialId);
    const balance = getCurrentBalance(siteId, materialId);
    if (!material) {
      return { balance: 0, reorderLevel: 0, low: false, label: 'No stock' };
    }
    const low = balance <= material.reorderLevel;
    return {
      balance,
      reorderLevel: material.reorderLevel,
      low,
      label: low ? 'Low stock' : 'Healthy',
    };
  }

  function populateSelects() {
    const siteOptions = state.sites
      .map((site) => `<option value="${escapeHtml(site.id)}">${escapeHtml(site.name)}</option>`)
      .join('');

    const materialOptions = state.materials
      .map((material) => `<option value="${escapeHtml(material.id)}">${escapeHtml(material.name)}</option>`)
      .join('');

    stockSiteFilter.innerHTML = `<option value="all">All sites</option>${siteOptions}`;
    stockMaterialFilter.innerHTML = `<option value="all">All materials</option>${materialOptions}`;

    const poVendor = document.getElementById('poVendor');
    const poSite = document.getElementById('poSite');
    poVendor.innerHTML = state.vendors
      .map((vendor) => `<option value="${escapeHtml(vendor.id)}">${escapeHtml(vendor.name)}</option>`)
      .join('');
    poSite.innerHTML = state.sites
      .map((site) => `<option value="${escapeHtml(site.id)}">${escapeHtml(site.name)}</option>`)
      .join('');

    document.getElementById('poDate').value = new Date().toISOString().slice(0, 10);

    const usageSite = document.getElementById('usageSite');
    const usageMaterial = document.getElementById('usageMaterial');
    usageSite.innerHTML = siteOptions;
    usageMaterial.innerHTML = materialOptions;

    attendanceDateInput.value = new Date().toISOString().slice(0, 10);
    payStartDate.value = new Date(Date.now() - 13 * 86400000).toISOString().slice(0, 10);
    payEndDate.value = new Date().toISOString().slice(0, 10);
  }

  function renderOverview() {
    const overview = document.getElementById('overviewCards');
    if (!overview) {
      return;
    }

    const totalOpenOrders = state.purchaseOrders.filter((order) => order.status !== 'Delivered').length;
    const attendanceDate = attendanceDateInput.value || new Date().toISOString().slice(0, 10);
    const dayRecords = state.attendance.filter((record) => record.date === attendanceDate);
    const workersPresent = dayRecords.filter((record) => record.status !== 'Absent').length;
    const lowStockCount = state.sites.flatMap((site) =>
      state.materials.filter((material) => getMaterialStatus(site.id, material.id).low).map(() => site.id)
    ).length;

    const sitePanels = state.sites.map((site) => {
      const entries = state.materials.map((material) => {
        const status = getMaterialStatus(site.id, material.id);
        const width = Math.min((status.balance / Math.max(status.reorderLevel, 1)) * 100, 100);
        return `
          <div class="bar-row">
            <div class="bar-row-head">
              <span>${escapeHtml(material.name)}</span>
              <strong>${status.balance}</strong>
            </div>
            <div class="bar-track">
              <span class="bar-fill" style="width: ${Math.max(width, 8)}%"></span>
              <span class="bar-reorder" style="left: ${Math.min((material.reorderLevel / Math.max(status.balance + material.reorderLevel, 1)) * 100, 96)}%"></span>
            </div>
          </div>
        `;
      }).join('');

      return `
        <article class="overview-card">
          <h3>${escapeHtml(site.name)}</h3>
          <div class="mini-list">
            ${entries}
          </div>
        </article>
      `;
    }).join('');

    overview.innerHTML = `
      <div class="overview-card">
        <h3>Site overview</h3>
        <div class="mini-list">
          ${sitePanels}
        </div>
      </div>
      <div class="overview-card">
        <h3>Alerts</h3>
        <div class="mini-list">
          <div class="metric-row"><span>Low-stock alerts</span><strong>${lowStockCount}</strong></div>
          <div class="metric-row"><span>Open purchase orders</span><strong>${totalOpenOrders}</strong></div>
          <div class="metric-row"><span>Attendance headcount</span><strong>${workersPresent}</strong></div>
        </div>
      </div>
    `;
  }

  function renderStockSummary() {
    const summary = document.getElementById('stockSummary');
    if (!summary) {
      return;
    }

    const siteFilter = stockSiteFilter.value;
    const materialFilter = stockMaterialFilter.value;
    const filteredSites = state.sites.filter((site) => siteFilter === 'all' || site.id === siteFilter);
    const filteredMaterials = state.materials.filter((material) => materialFilter === 'all' || material.id === materialFilter);

    let totalUnits = 0;
    let lowCount = 0;

    filteredSites.forEach((site) => {
      filteredMaterials.forEach((material) => {
        const status = getMaterialStatus(site.id, material.id);
        totalUnits += status.balance;
        if (status.low) {
          lowCount += 1;
        }
      });
    });

    summary.innerHTML = `
      <div class="summary-tile">
        <span>Stock on hand</span>
        <strong>${totalUnits}</strong>
      </div>
      <div class="summary-tile">
        <span>Low stock</span>
        <strong>${lowCount}</strong>
      </div>
      <div class="summary-tile">
        <span>Sites</span>
        <strong>${filteredSites.length}</strong>
      </div>
      <div class="summary-tile">
        <span>Materials</span>
        <strong>${filteredMaterials.length}</strong>
      </div>
    `;
  }

  function renderStockTable() {
    const tableBody = document.getElementById('stockTableBody');
    if (!tableBody) {
      return;
    }

    const siteFilter = stockSiteFilter.value;
    const materialFilter = stockMaterialFilter.value;

    const rows = state.sites.flatMap((site) => {
      return state.materials
        .filter((material) => materialFilter === 'all' || material.id === materialFilter)
        .map((material) => {
          const status = getMaterialStatus(site.id, material.id);
          if (siteFilter !== 'all' && site.id !== siteFilter) {
            return null;
          }

          const statusLabel = status.low ? 'Low stock' : 'Healthy';
          return `
            <tr>
              <td>${escapeHtml(site.name)}</td>
              <td>${escapeHtml(material.name)}</td>
              <td>${status.balance} ${escapeHtml(material.unit)}</td>
              <td>${material.reorderLevel} ${escapeHtml(material.unit)}</td>
              <td><span class="badge-status ${status.low ? 'badge-warning' : 'badge-approved'}">${statusLabel}</span></td>
            </tr>
          `;
        });
    }).filter(Boolean).join('');

    tableBody.innerHTML = rows || '<tr><td colspan="5">No stock records match the selected filters.</td></tr>';
    renderStockSummary();
    renderLedgerTable();
  }

  function renderLedgerTable() {
    const ledgerTableBody = document.getElementById('ledgerTableBody');
    if (!ledgerTableBody) {
      return;
    }

    const siteFilter = stockSiteFilter.value;
    const materialFilter = stockMaterialFilter.value;

    const rows = state.transactions
      .filter((transaction) => {
        const matchesSite = siteFilter === 'all' || transaction.siteId === siteFilter;
        const matchesMaterial = materialFilter === 'all' || transaction.materialId === materialFilter;
        return matchesSite && matchesMaterial;
      })
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((transaction) => {
        const site = getSiteById(transaction.siteId);
        const material = getMaterialById(transaction.materialId);
        return `
          <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${escapeHtml(site ? site.name : 'Unknown site')}</td>
            <td>${escapeHtml(material ? material.name : 'Unknown')}</td>
            <td>${transaction.type}</td>
            <td>${transaction.quantity} ${escapeHtml(material ? material.unit : '')}</td>
            <td>${escapeHtml(transaction.note || '—')}</td>
            <td>${escapeHtml(transaction.note || '—')}</td>
          </tr>
        `;
      })
      .join('');

    ledgerTableBody.innerHTML = rows || '<tr><td colspan="7">No ledger entries in this filter range.</td></tr>';
  }

  function addPoItemRow() {
    const row = document.createElement('div');
    row.className = 'po-item-row';
    row.innerHTML = `
      <label>
        Material
        <select>
          ${state.materials.map((material) => `<option value="${escapeHtml(material.id)}">${escapeHtml(material.name)}</option>`).join('')}
        </select>
      </label>
      <label>
        Quantity
        <input type="number" min="1" value="1" />
      </label>
      <button class="button button-secondary inline-button remove-po-item" type="button">Remove</button>
    `;

    row.querySelector('.remove-po-item').addEventListener('click', () => row.remove());
    poItemsContainer.appendChild(row);
  }

  function renderPurchaseOrders() {
    const rows = state.purchaseOrders.map((order) => {
      const vendor = getVendorById(order.vendorId);
      const site = getSiteById(order.siteId);
      const itemSummary = order.items.map((item) => {
        const material = getMaterialById(item.materialId);
        return `${material ? material.name : item.materialId}: ${item.quantity}`;
      }).join(', ');

      const statusClass = order.status === 'Open' ? 'badge-open' : order.status === 'Approved' ? 'badge-approved' : 'badge-delivered';

      return `
        <tr>
          <td>${escapeHtml(order.id)}</td>
          <td>${escapeHtml(vendor ? vendor.name : order.vendorName || 'Unknown')}</td>
          <td>${escapeHtml(site ? site.name : 'Unknown')}</td>
          <td><span class="badge-status ${statusClass}">${escapeHtml(order.status)}</span></td>
          <td>${escapeHtml(itemSummary)}</td>
          <td>
            <div class="action-buttons">
              ${order.status === 'Open' ? '<button class="button button-secondary" type="button" data-action="approve" data-po-id="' + order.id + '">Approve</button>' : ''}
              ${order.status !== 'Delivered' ? '<button class="button button-primary" type="button" data-action="deliver" data-po-id="' + order.id + '">Mark delivered</button>' : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    purchaseOrdersTableBody.innerHTML = rows || '<tr><td colspan="6">No purchase orders in the demo yet.</td></tr>';

    purchaseOrdersTableBody.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const poId = button.dataset.poId;
        const action = button.dataset.action;
        if (action === 'approve') {
          updatePurchaseOrderStatus(poId, 'Approved');
        }
        if (action === 'deliver') {
          markPurchaseOrderDelivered(poId);
        }
      });
    });
  }

  function updatePurchaseOrderStatus(poId, nextStatus) {
    const order = state.purchaseOrders.find((entry) => entry.id === poId);
    if (!order) {
      return;
    }
    order.status = nextStatus;
    app.saveState(state);
    renderPurchaseOrders();
    renderOverview();
    showToast(`Purchase order ${poId} marked as ${nextStatus}.`);
  }

  function markPurchaseOrderDelivered(poId) {
    const order = state.purchaseOrders.find((entry) => entry.id === poId);
    if (!order) {
      return;
    }

    order.status = 'Delivered';
    order.items.forEach((item) => {
      state.transactions.push({
        id: `txn-${Date.now()}-${item.materialId}`,
        siteId: order.siteId,
        materialId: item.materialId,
        type: 'IN',
        quantity: item.quantity,
        date: new Date().toISOString().slice(0, 10),
        note: `${order.id} delivered`,
      });
    });

    app.saveState(state);
    renderPurchaseOrders();
    renderOverview();
    renderStockTable();
    showToast(`Purchase order ${poId} delivered and stock updated.`);
  }

  function createOrderFromForm(event) {
    event.preventDefault();

    const vendorId = document.getElementById('poVendor').value;
    const siteId = document.getElementById('poSite').value;
    const orderDate = document.getElementById('poDate').value || new Date().toISOString().slice(0, 10);
    const notes = document.getElementById('poNotes').value.trim();

    const itemRows = Array.from(poItemsContainer.querySelectorAll('.po-item-row'));
    const items = itemRows.map((row) => {
      const materialId = row.querySelector('select')?.value;
      const quantity = Number(row.querySelector('input')?.value || 0);
      if (!materialId || !quantity || quantity <= 0) {
        return null;
      }
      return { materialId, quantity };
    }).filter(Boolean);

    if (!items.length) {
      showToast('Add at least one material to the order.');
      return;
    }

    const orderId = `PO-${String(state.purchaseOrders.length + 1000).slice(-4)}`;
    state.purchaseOrders.unshift({
      id: orderId,
      siteId,
      vendorId,
      vendorName: getVendorById(vendorId)?.name || '',
      orderDate,
      status: 'Open',
      notes,
      items,
    });

    app.saveState(state);
    purchaseOrderForm.reset();
    poItemsContainer.innerHTML = '';
    addPoItemRow();
    renderPurchaseOrders();
    renderOverview();
    showToast(`Order ${orderId} created.`);
  }

  function renderAttendanceTable() {
    const selectedDate = attendanceDateInput.value || new Date().toISOString().slice(0, 10);
    const attendanceEntries = state.attendance.filter((entry) => entry.date === selectedDate);

    const rows = state.workers.map((worker) => {
      const entry = attendanceEntries.find((item) => item.workerId === worker.id) || {
        workerId: worker.id,
        date: selectedDate,
        status: 'Present',
      };

      const optionMarkup = ['Present', 'Half-day', 'Absent']
        .map((status) => `<option value="${status}" ${entry.status === status ? 'selected' : ''}>${status}</option>`)
        .join('');

      return `
        <tr>
          <td>${escapeHtml(worker.name)}</td>
          <td>${escapeHtml(worker.role)}</td>
          <td>${formatMoney(worker.hourlyRate * 8)}</td>
          <td>
            <select class="attendance-status" data-worker-id="${worker.id}" data-date="${selectedDate}">
              ${optionMarkup}
            </select>
          </td>
        </tr>
      `;
    }).join('');

    attendanceTableBody.innerHTML = rows;

    attendanceTableBody.querySelectorAll('.attendance-status').forEach((select) => {
      select.addEventListener('change', (event) => {
        const workerId = event.target.dataset.workerId;
        const date = event.target.dataset.date;
        const nextStatus = event.target.value;

        let existing = state.attendance.find((entry) => entry.workerId === workerId && entry.date === date);
        if (!existing) {
          state.attendance.push({ id: `att-${workerId}-${date}`, workerId, date, status: nextStatus });
        } else {
          existing.status = nextStatus;
        }

        app.saveState(state);
        renderPaySummary();
      });
    });
  }

  function calculatePaySummary() {
    const start = getDateValue(payStartDate.value);
    const end = getDateValue(payEndDate.value);
    const startValue = start.getTime();
    const endValue = end.getTime();

    const workerTotals = state.workers.map((worker) => {
      const totalDays = Array.from({ length: Math.max(1, Math.ceil((endValue - startValue) / 86400000) + 1) }, (_, index) => {
        const date = new Date(startValue + index * 86400000);
        return formatDateInput(date);
      });

      const totalHours = totalDays.reduce((sum, date) => {
        const record = state.attendance.find((entry) => entry.workerId === worker.id && entry.date === date);
        const statusValue = record ? { Present: 1, 'Half-day': 0.5, Absent: 0 }[record.status] || 0 : 0;
        return sum + statusValue;
      }, 0);

      const total = totalHours * worker.hourlyRate;
      return { worker, total };
    });

    const totalDue = workerTotals.reduce((sum, item) => sum + item.total, 0);
    return { workerTotals, totalDue };
  }

  function renderPaySummary() {
    const paySummary = document.getElementById('paySummary');
    if (!paySummary) {
      return;
    }

    const { workerTotals, totalDue } = calculatePaySummary();
    const rows = workerTotals.map(({ worker, total }) => `
      <div class="summary-tile">
        <span>${escapeHtml(worker.name)}</span>
        <strong>${formatMoney(total)}</strong>
      </div>
    `).join('');

    paySummary.innerHTML = `
      <p><strong>Wages due from ${escapeHtml(payStartDate.value || '')} to ${escapeHtml(payEndDate.value || '')}</strong></p>
      <div class="pay-summary-grid">
        ${rows}
        <div class="summary-tile">
          <span>Total due</span>
          <strong>${formatMoney(totalDue)}</strong>
        </div>
      </div>
    `;
  }

  function openUsageDialog() {
    if (!usageDialog) {
      return;
    }
    usageDialog.classList.remove('hidden');
  }

  function closeUsageDialog() {
    if (!usageDialog) {
      return;
    }
    usageDialog.classList.add('hidden');
  }

  document.getElementById('recordUsageButton').addEventListener('click', openUsageDialog);
  document.getElementById('closeUsageDialog').addEventListener('click', closeUsageDialog);
  usageDialog.addEventListener('click', (event) => {
    if (event.target === usageDialog) {
      closeUsageDialog();
    }
  });

  usageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const siteId = document.getElementById('usageSite').value;
    const materialId = document.getElementById('usageMaterial').value;
    const quantity = Number(document.getElementById('usageQuantity').value || 0);
    const note = document.getElementById('usageNote').value.trim();

    if (!siteId || !materialId || quantity <= 0) {
      showToast('Choose a site, material and quantity.');
      return;
    }

    const currentBalance = getCurrentBalance(siteId, materialId);
    if (quantity > currentBalance) {
      showToast('Usage cannot exceed stock on hand.');
      return;
    }

    state.transactions.push({
      id: `txn-${Date.now()}`,
      siteId,
      materialId,
      type: 'OUT',
      quantity,
      date: new Date().toISOString().slice(0, 10),
      note: note || 'Manual usage',
    });

    app.saveState(state);
    usageForm.reset();
    closeUsageDialog();
    renderOverview();
    renderStockTable();
    showToast('Usage recorded.');
  });

  purchaseOrderForm.addEventListener('submit', createOrderFromForm);
  document.getElementById('addPoItemButton').addEventListener('click', addPoItemRow);
  resetDemoButton.addEventListener('click', () => {
    state = app.resetState();
    populateSelects();
    renderOverview();
    renderStockTable();
    renderPurchaseOrders();
    renderAttendanceTable();
    renderPaySummary();
    showToast('Demo data reset.');
  });

  stockSiteFilter.addEventListener('change', renderStockTable);
  stockMaterialFilter.addEventListener('change', renderStockTable);
  attendanceDateInput.addEventListener('change', renderAttendanceTable);
  payStartDate.addEventListener('change', renderPaySummary);
  payEndDate.addEventListener('change', renderPaySummary);
  document.getElementById('calculatePayButton').addEventListener('click', renderPaySummary);

  addPoItemRow();
  populateSelects();
  renderOverview();
  renderStockTable();
  renderPurchaseOrders();
  renderAttendanceTable();
  renderPaySummary();
});
