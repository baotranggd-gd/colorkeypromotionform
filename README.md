OPS PORTAL – MEISHANG VIỆT NAM

1. Tổng quan

OPS PORTAL là hệ thống quản lý vận hành nội bộ của Meishang Việt Nam, hỗ trợ các hoạt động Sales Operations, Order Processing, CRM, Product, Promotion, Warehouse và Report & Analytics.

Portal được thiết kế theo hướng tập trung dữ liệu và chuẩn hóa quy trình vận hành, giúp giảm thao tác thủ công và tăng khả năng kiểm soát dữ liệu.

2. Các module chính

Dashboard

Order Processing

CRM

Product Management

Promotion Management

Warehouse

Report & Analytics

Base Data

Setting

3. Dashboard

Dashboard ưu tiên Sales Visual trước, sau đó mới đến các chỉ số vận hành.

Sales KPI

Final Revenue

Orders Qty

Sales Qty

Customers

AOV

Sales Visual

Sales Revenue Trend by Month

Revenue by Channel

Top Customers

Top Products

Revenue by Team PIC

Quy tắc Orders Qty

Orders Qty được tính theo số lượng Doc No. duy nhất, không phải số dòng dữ liệu.

Sales Document Type

Portal chuẩn hóa Doc Type thành:

Normal Order

Return

Back Margin

Other

Sales Data

Các trường dữ liệu chính:

Quarter

Month

Doc Type

Doc No.

Customer Code

Customer Name

Channel

PIC

Team PIC

Material Code

Type

Sales Qty

U/P

Amount

Back Margin

Additional BM

Final Revenue

Bộ lọc Dashboard

Dashboard hỗ trợ lọc dữ liệu Sales theo các dimension liên quan như thời gian, channel, team/PIC, customer, product và các trường dữ liệu sales hiện có.

4. Order Processing

Order Processing là module xử lý đơn hàng và kiểm tra khả năng đáp ứng đơn.

Các workflow chính

1. Check Stock

Quick Check

Upload File to Check

Kiểm tra tồn kho theo sản phẩm

Xác định khả năng đáp ứng đơn

2. Create Order

Chọn khách hàng

Nhập sản phẩm

Tính khuyến mãi tự động

Áp dụng chính sách chiết khấu khách hàng

Kiểm tra stock

Xử lý nhiều chương trình khuyến mãi khi phù hợp

3. Transform Order

Dùng để bóc tách PO PDF thành dữ liệu order chuẩn.

Upload PO PDF

Đọc dữ liệu bằng PDF.js

Match Product Code / Barcode

Xác định trạng thái sản phẩm

Chuẩn hóa dữ liệu thành form order

Các trạng thái matching gồm:

Matched

Potential

Not Found

Inactive

Duplicate

5. Promotion Engine

Promotion Management quản lý các chương trình khuyến mãi và Promotion Engine dùng để tự động tính khuyến mãi khi tạo order.

Thông tin chương trình

Promotion Code

Promotion Name

Promotion Type

Region

Channel

Customer Rank

Priority

Product / Scheme

Effective Time

Status

Bộ lọc

Search

Region

Channel

Customer Rank

Status

From Date

To Date

Channel

Online

MT

GT

KA

Region

Ví dụ:

Toàn quốc

GT SOUTH

HCM

Hà Nội

Đà Nẵng

Status

Đang chạy

Sắp chạy

Đã kết thúc

Tạm dừng

Multiple Schemes

Một promotion có thể chứa nhiều scheme.

Đối với chương trình theo mốc doanh số, giao diện hiện tại áp dụng mốc doanh số cao nhất đạt được thay vì cộng dồn nhiều mốc.

6. CRM

CRM quản lý thông tin khách hàng và được sử dụng để enrich dữ liệu Sales / Order.

Các thông tin chính gồm:

Customer Code

Customer Name

Region

Channel

Customer Rank

PIC

Các thông tin phân loại khách hàng liên quan

Customer Code được sử dụng làm key để mapping với Sales Data.

7. Product Management

Product Management là master data của sản phẩm.

Thông tin sản phẩm

Product Code

Barcode

Product Name

Listing Price

Daily Price

Wholesale Price

Category

Brand

Product Line

Type

Status

Tìm kiếm

Có thể tìm theo:

Product Name

Barcode

Product Code

Trạng thái

Active

Inactive

Product master được dùng để mapping và enrich Sales Data, Order Processing và Warehouse.

8. Warehouse

Warehouse tập trung vào tồn kho thực tế và Stock Day, không quản lý giá trị tồn kho.

KPI

Total SKU

Total Stock

Low Stock

Out of Stock

Warning SKU

Safety Stock

Mức Safety Stock hiện tại:

15 ngày

Đây là ngưỡng an toàn được sử dụng để cảnh báo tồn kho.

Warning theo Team

Nếu Owner Team của SKU khác Current Team, hệ thống hiển thị cảnh báo để tránh thao tác nhầm với sản phẩm thuộc team khác.

Bộ lọc

Brand

Category

Line

Type

Warehouse

Owner Team

Status

SKU / Product Search

Inventory Status

SAFE

WARNING

TEAM_WARNING

CRITICAL

URGENT

OOS

HIGH_STOCK

NO_DATA

Drilldown

ALL

LOW

OOS

WARNING

Thông tin hiển thị

SKU

Product Name

Brand

Category

Line

Type

Warehouse

Stock Qty

Stock Day

Status

Owner Team

Warning

9. Report & Analytics

Report & Analytics dùng để phân tích dữ liệu Sales.

KPI

Final Revenue

Amount

Sales Qty

Orders / Documents

Customers

Phân tích

Revenue theo Channel

Revenue theo Month

Sales Detail

Customer analysis

Product analysis

Sales Data được mapping với:

Customer Code → CRM

Material Code → Product Management

10. Base Data

Base Data là lớp master/configuration dùng chung cho Portal.

Product Master

Quản lý các thuộc tính nền tảng:

Brand

Category

Product Line

Type

Customer Master

Quản lý các thuộc tính:

Region

Channel

Customer Rank

Discount Policy

Discount Policy

Chính sách chiết khấu khách hàng được áp dụng theo Customer Rank khi tạo order.

Base Data giúp hạn chế việc nhập và duy trì cùng một thông tin ở nhiều module khác nhau.

11. Setting

Setting là khu vực cấu hình cấp Portal.

Các cấu hình được sử dụng để hỗ trợ hoạt động và kiểm soát hệ thống.

12. Global Search

Global Search hỗ trợ tìm nhanh theo các thông tin vận hành như:

Order Number

Customer

SKU

Barcode

Khi tìm kiếm customer, hệ thống có thể cập nhật customer context đang được chọn để sử dụng cho các bước tiếp theo.

13. Data Integration

Portal sử dụng Google Sheets và Google Apps Script Web App để kết nối dữ liệu vận hành.

Các nguồn dữ liệu chính

Sales Data

CRM

Product Master

Promotion Data

Warehouse / Inventory Data

Base Data

Mapping chính

Sales Data
    │
    ├── Customer Code ──→ CRM
    │
    └── Material Code ──→ Product Management

Thông qua mapping này, Sales Data có thể được bổ sung các thông tin về:

Customer

Region

Customer Rank

Brand

Category

Product Line

Type

14. Luồng vận hành tổng thể

Luồng nghiệp vụ chính của Portal:

PO / Order Input
       ↓
Order Processing
       ↓
Product Matching / Order Transformation
       ↓
Promotion Calculation
       ↓
Stock Check
       ↓
Order Result

Song song đó:

Sales Data
    ↓
Dashboard
    ↓
Report & Analytics

và:

Product Master ──→ Order / Sales / Warehouse
CRM ─────────────→ Order / Sales / Dashboard
Promotion ───────→ Order Processing
Warehouse ───────→ Stock Check
Base Data ───────→ Các module liên quan

15. Technology Stack

Portal hiện sử dụng:

HTML5

Tailwind CSS

JavaScript

Chart.js

SheetJS

jsPDF

AutoTable

PDF.js

Lucide Icons

Google Apps Script Web App

Google Sheets

Portal được xây dựng theo hướng client-side SPA-style.

16. UX / UI Principles

Các nguyên tắc chính:

Dashboard ưu tiên Sales Visual

KPI dễ đọc

Filter trực tiếp

Table có search và filter

Tập trung vào workflow vận hành

Hạn chế nhập liệu thủ công

Tái sử dụng master data

Cảnh báo rõ các trường hợp cần xử lý

Ưu tiên dữ liệu thực tế thay vì thông tin dư thừa

17. Các Business Rules quan trọng

Sales

Orders Qty = unique Doc No.

Doc Type được chuẩn hóa thành Normal Order / Return / Back Margin / Other.

Final Revenue được sử dụng làm chỉ số doanh thu chính trên Dashboard.

Order

Product có thể được nhận diện bằng Product Code hoặc Barcode.

Promotion được tính trước khi xác định kết quả order.

Customer Discount được lấy từ Discount Policy theo Customer Rank.

Stock phải được kiểm tra trước khi xác nhận khả năng đáp ứng.

Promotion

Promotion có thể có nhiều scheme.

Promotion phụ thuộc vào Region, Channel, Customer Rank, thời gian hiệu lực và các điều kiện của scheme.

Chương trình theo mốc doanh số sử dụng mốc cao nhất đạt được theo logic hiện tại.

Warehouse

Safety Stock Day = 15 ngày.

SKU thuộc team khác phải được cảnh báo.

Warehouse tập trung vào Stock Qty và Stock Day, không quản lý Inventory Value.

18. Cấu trúc file

Portal hiện tại là một web application tập trung trong file HTML chính, bao gồm:

OPS PORTAL
├── Dashboard
├── Order Processing
├── CRM
├── Product Management
├── Promotion Management
├── Warehouse
├── Report & Analytics
├── Base Data
└── Setting

Các thư viện bên ngoài được load để xử lý:

Tailwind CSS
Chart.js
SheetJS
jsPDF
AutoTable
PDF.js
Lucide Icons

19. Phiên bản

Phiên bản hiện tại được xây dựng trên nền Portal V4 / Promotion Engine V4.

README này mô tả phiên bản Portal mới nhất được sử dụng làm source tại thời điểm cập nhật.

20. Định hướng phát triển

Các hướng phát triển tiếp theo có thể bao gồm:

Mở rộng Dashboard và Sales Analytics

Mở rộng Promotion Engine

Tăng độ chính xác Product Matching

Tự động hóa Order Processing

Mở rộng Warehouse Warning

Chuẩn hóa Base Data

Tăng khả năng audit và tracking dữ liệu

Mở rộng báo cáo theo Channel / Region / Team / Customer / Product

21. Business Context

OPS PORTAL được xây dựng để phục vụ hoạt động vận hành Sales / B2B của Meishang Việt Nam, đặc biệt trong các nghiệp vụ:

Sales Operations

Order Processing

Promotion

Customer Management

Product Management

Inventory / Warehouse

Sales Reporting & Analytics

Mục tiêu chính là tạo một hệ thống vận hành tập trung, giảm thao tác thủ công và chuẩn hóa cách dữ liệu được sử dụng giữa các team.
