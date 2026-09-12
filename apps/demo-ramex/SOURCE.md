# Ramex demo source provenance

This workspace is a narrow adaptation of the whole-roll point-of-sale and invoice flow from Ramex Store (`7ossam26/Ramex-Store`) at the audited ledger revision `0857f27ae4b9b327fb7f24cd83de038bb0b2ac86`.

The source repository has no root `LICENSE`, `NOTICE`, or `COPYING` file. This provenance record does not grant or imply an open-source license. The original repository remains read-only and is not included in this build.

The selected UI maps from `frontend/src/pages/pos/POS.tsx`, `frontend/src/pages/inventory/StockView.tsx`, `frontend/src/pages/invoices/DraftInvoicePrintPage.tsx`, `frontend/src/components/invoices/DraftInvoiceDocument.tsx`, and the source Warm Editorial design tokens. The local rules map from `backend/src/domain/sales/sales.schemas.ts`, `backend/src/domain/sales/lineQuantity.ts`, `backend/src/domain/sales/invoices.service.ts`, and migration `096_invoice_line_sold_quantity_snapshot.ts` at the audited revision.

The source sale request identifies a roll but does not accept a partial sale quantity. This demo therefore derives the complete `30.000 meter` quantity from the selected roll, preserves that quantity/unit on the invoice, and changes only that roll from in stock to sold. The visible quantity is intentionally read-only. A second roll of the same fictional fabric remains independent.

All people, fabric records, roll numbers, customer details, prices, invoice numbers, and dates are fictional. The extracted application replaces auth, session concurrency, connectivity polling, routing, server APIs, database transactions, and production shifts with one deterministic in-memory service and a labeled sample cashier/open shift. The V1 path is cash-only and shop-only. It cannot call a production API or persist data.

Detailed source-to-local mappings, checkout limitations, service behavior, and screenshot provenance are recorded in `docs/portfolio/source-audit.md` and `docs/portfolio/validation/phase-07.md`.
