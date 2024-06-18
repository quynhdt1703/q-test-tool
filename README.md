# Auto Test Tool

## Tính năng

- Quản lý danh sách các **project** (dự án)
- Mỗi **project** chứa các trường:

  - `Name` (tên)
  - `Description` (mô tả)
  - `Stages`: Một danh sách quá trình, mỗi stage chứa trường `VUS` (Virtual users, tức là số user giả lập) và trường `Duration` (thời gian) của stage đó.

    Ví dụ, stage đầu sẽ giả lập 10 user chạy trong 10 giây, stage 2 giả lập tăng lên 50 user chạy trong 20 giây,...

  - `Variables`: Biến môi trường, để tiện cho việc cấu hình các **request**, đỡ bị lặp lại giá trị nào đó - Ví dụ như **access token** để xác thực cho một **request** tới một HTTP API.

- Ngoài ra, một **project** có danh sách các **request**, tức là các đầu API gọi tới HTTP Server, ví dụ get danh sách cư dân, thêm cư dân mới,...

  Mỗi request chứa cấu hình cho một HTTP Request cần thiết như: `host`, `port`, `path`, `protocol`, `headers`, `params`, `body`, ngoài ra chứa trường `name` để dễ quản lý.

- Khi đầy đủ cấu hình cho **project**, có thể chạy để xem, xuất kết quả (chưa làm tính năng này).
- Tính năng chưa làm:
  - Update **project** trong màn hình **project** chi tiết
  - Update **request**
  - Run **Project**
  - Xuất, thống kê kết quả

## Công nghệ sử dụng

- NodeJS để xử lý phần core (lõi) như tạo các project, chạy project,..., dữ liệu lưu vào database dạng file (JSON file).
- React JS và thư viện `antd` để phát triển giao diện, dùng để quản lý **project**, chạy và xem kết quả dễ dàng hơn.
