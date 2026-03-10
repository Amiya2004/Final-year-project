import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order, storeName = 'FreshMart', storePhone = '', storeEmail = '') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    let y = 18;

    // Colors
    const primary = [5, 150, 105];     // #059669
    const primaryDark = [4, 120, 87];  // #047857
    const dark = [30, 41, 59];         // #1e293b
    const muted = [100, 116, 139];     // #64748b
    const light = [241, 245, 249];     // #f1f5f9
    const accent = [16, 185, 129];     // #10b981

    // --- Header bar with gradient effect ---
    doc.setFillColor(...primary);
    doc.rect(0, 0, pageWidth, 44, 'F');
    doc.setFillColor(...primaryDark);
    doc.rect(0, 36, pageWidth, 8, 'F');

    // Store name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(storeName, margin, 20);

    // Store contact info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const headerInfo = [storePhone, storeEmail].filter(Boolean).join('  |  ');
    if (headerInfo) doc.text(headerInfo, margin, 28);

    // Receipt title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', pageWidth - margin, 20, { align: 'right' });

    const invoiceNum = order.orderId || order.id?.substring(0, 8)?.toUpperCase() || 'N/A';
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${invoiceNum}`, pageWidth - margin, 30, { align: 'right' });

    y = 54;

    // --- Invoice meta row ---
    const metaBoxY = y;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, metaBoxY, pageWidth - margin * 2, 22, 3, 3, 'F');

    const invoiceDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A';
    const statusLabel = (order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1);
    const paymentMethod = order.payment?.method === 'cod' ? 'Cash on Delivery' : order.payment?.method === 'razorpay' ? 'Razorpay (Online)' : order.payment?.method || 'N/A';

    const colWidth = (pageWidth - margin * 2) / 3;

    // Date column
    doc.setTextColor(...muted);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DATE', margin + 8, metaBoxY + 8);
    doc.setTextColor(...dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceDate, margin + 8, metaBoxY + 15);

    // Status column
    doc.setTextColor(...muted);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('STATUS', margin + colWidth + 8, metaBoxY + 8);
    // Color-coded status
    if (order.status === 'delivered') {
        doc.setTextColor(34, 197, 94);
    } else if (order.status === 'cancelled') {
        doc.setTextColor(239, 68, 68);
    } else {
        doc.setTextColor(245, 158, 11);
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(statusLabel, margin + colWidth + 8, metaBoxY + 15);

    // Payment column
    doc.setTextColor(...muted);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT', margin + colWidth * 2 + 8, metaBoxY + 8);
    doc.setTextColor(...dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentMethod, margin + colWidth * 2 + 8, metaBoxY + 15);

    y = metaBoxY + 30;

    // --- Bill To & Ship To ---
    doc.setFillColor(...light);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 36, 3, 3, 'F');

    // Left side: Bill To
    doc.setTextColor(...primary);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', margin + 6, y + 8);

    doc.setTextColor(...dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const customerName = order.address?.fullName || order.customerName || 'N/A';
    doc.text(customerName, margin + 6, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const addr = order.address;
    let addressLine = '';
    if (addr) {
        const parts = [addr.addressLine1, addr.addressLine2, addr.city, addr.state].filter(Boolean);
        addressLine = parts.join(', ');
        if (addr.pincode) addressLine += ` - ${addr.pincode}`;
    }
    doc.setTextColor(...muted);
    if (addressLine) doc.text(addressLine, margin + 6, y + 23);

    // Right side: Contact
    const phone = order.address?.phone || order.customerPhone || '';
    const email = order.address?.email || order.customerEmail || '';
    if (phone) {
        doc.setTextColor(...muted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CONTACT', pageWidth - margin - 6, y + 8, { align: 'right' });
        doc.setTextColor(...dark);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(phone, pageWidth - margin - 6, y + 16, { align: 'right' });
        if (email) doc.text(email, pageWidth - margin - 6, y + 23, { align: 'right' });
    }

    // Payment ID if available
    if (order.payment?.razorpay_payment_id) {
        doc.setTextColor(...muted);
        doc.setFontSize(7.5);
        doc.text(`Payment ID: ${order.payment.razorpay_payment_id}`, margin + 6, y + 31);
    }

    y += 44;

    // --- Items Table ---
    const items = order.items || [];
    const tableBody = items.map((item, idx) => [
        idx + 1,
        item.name + (item.brand ? ` (${item.brand})` : '') + (item.unit ? `  •  ${item.unit}` : ''),
        item.quantity,
        `Rs.${Number(item.price).toFixed(2)}`,
        `Rs.${(item.price * item.quantity).toFixed(2)}`
    ]);

    const tableResult = autoTable(doc, {
        startY: y,
        head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Amount']],
        body: tableBody,
        margin: { left: margin, right: margin },
        theme: 'plain',
        headStyles: {
            fillColor: primary,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 5,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: dark,
            cellPadding: 5,
            lineColor: [230, 235, 240],
            lineWidth: 0.3,
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: {
            0: { cellWidth: 14, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 32, halign: 'right' },
            4: { cellWidth: 32, halign: 'right' },
        },
    });

    y = (tableResult?.finalY ?? doc.lastAutoTable?.finalY ?? y + 40) + 12;

    // --- Summary box (right-aligned) ---
    const summaryX = pageWidth - margin - 85;
    const summaryW = 85;

    const subtotal = order.subtotal || items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const deliveryFee = order.deliveryFee ?? 0;
    const discount = order.discount ?? 0;
    const total = order.total || (subtotal + deliveryFee - discount);

    // Summary background
    doc.setFillColor(250, 251, 252);
    doc.roundedRect(summaryX - 8, y - 6, summaryW + 16, discount > 0 ? 52 : 44, 3, 3, 'F');

    // Subtotal
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...muted);
    doc.text('Subtotal', summaryX, y + 2);
    doc.setTextColor(...dark);
    doc.text(`Rs.${Number(subtotal).toFixed(2)}`, summaryX + summaryW, y + 2, { align: 'right' });
    y += 9;

    // Delivery
    doc.setTextColor(...muted);
    doc.text('Delivery Fee', summaryX, y + 2);
    doc.setTextColor(...dark);
    doc.text(deliveryFee === 0 ? 'FREE' : `Rs.${Number(deliveryFee).toFixed(2)}`, summaryX + summaryW, y + 2, { align: 'right' });
    y += 9;

    // Discount (if any)
    if (discount > 0) {
        doc.setTextColor(239, 68, 68);
        doc.text('Discount', summaryX, y + 2);
        doc.text(`-Rs.${Number(discount).toFixed(2)}`, summaryX + summaryW, y + 2, { align: 'right' });
        y += 9;
    }

    // Divider
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.5);
    doc.line(summaryX - 4, y, summaryX + summaryW + 4, y);
    y += 7;

    // Total pill
    doc.setFillColor(...primary);
    doc.roundedRect(summaryX - 8, y - 5, summaryW + 16, 15, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL', summaryX, y + 4);
    doc.text(`Rs.${Number(total).toFixed(2)}`, summaryX + summaryW, y + 4, { align: 'right' });

    y += 28;

    // --- Terms / Note ---
    if (y < pageHeight - 55) {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 20, 3, 3, 'F');
        doc.setTextColor(...muted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Note: This is a computer-generated receipt and does not require a signature.', margin + 6, y + 8);
        doc.setFont('helvetica', 'normal');
        doc.text('For queries, contact us at ' + (storeEmail || storePhone || storeName), margin + 6, y + 15);
    }

    // --- Footer ---
    const footerY = pageHeight - 18;
    doc.setFillColor(...primary);
    doc.rect(0, footerY - 10, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your purchase!', pageWidth / 2, footerY, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${storeName}  •  Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, footerY + 6, { align: 'center' });

    // Save
    const fileName = `Receipt_${invoiceNum}.pdf`;
    doc.save(fileName);
};
