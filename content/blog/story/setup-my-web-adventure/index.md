+++
title = "Hành trình chuyển trang web từ Free Builder của VinaHost sang Zola với Cloudflare Worker (Phần 1)"
date = 2026-03-02
description = "Toàn bộ công cuộc trang hoàng lại trang web của tui từ một trang Free Builder được cấp bên VinaHost sang Zola như hiện tại và được host trên Cloudflare Worker - Phần 1: Tìm ra những bất cập của Free Builder"
[taxonomies]
tags = ["web", "hosting", "cms", "cloudflare", "zola"]
[extra]
toc = true
+++

> Nếu ai đó nói với tui rằng cái trang web 'miễn phí' sẽ khiến tui mất hàng chục giờ debug và gần bỏ cuộc, chắc tui vẫn đăng ký — vì tui cứng đầu vậy đó.

## Mở đầu
Nhớ lại cái thời mà tui đăng ký tên miền `id.vn` là vào ngay dịp lễ 30/04/2025 và lúc đó vẫn còn ưu đãi 2 năm miễn phí tên miền và tặng kèm trang web và email, tui ngó nghiêng đến rất nhiều nền tảng khác nhau như TenTen, iNet,... Sau khi cân nhắc một hồi, tui bị cuốn hút bởi gói tặng kèm một trang web Free Builder của VinaHost. Lúc đó tui đã nghĩ nó là một món rất hời. Thế là tui làm các thủ tục online để đăng ký luôn hehe.

Sau khi có được tên miền và trang web, tui bắt đầu quá trình mò mẫm cái Free Builder mà bên đó cung cấp, nó là của bên SiteProBuilder. 

{{ img_cap(src="image-2.png", caption="Giao diện SiteProBuilder") }}

Tui tưởng đâu là tui sẽ được mở khóa SiteProBuilder lên bản Premium. Ai có mà dè... khi tui vào edit trang thì nó vẫn còn ở chế độ **Free**, không có blog, không có những công cụ nâng cao để xây dựng một trang web cho ra trò. Tui bắt đầu thấy có gì đó không ổn. Ủa rõ ràng là tui được cho Builder mà chỉ loanh quanh tạo CV với portfolio thì hơi kì đấy ba.

{{ img_cap(src="image-3.png", caption="Giao diện Upgrade thì mới dùng được Blog") }}

Đã vậy nó còn giới hạn inode[^1] nữa chứ, cực kỳ khó chịu với 1 trang web cá nhân cần nhiều thứ như tui. Ngoài ra khi tui check dịch vụ thì nó có giá là 120k/năm để mà gia hạn cái này. Tính ra là 10k/tháng, mà SiteProBuilder gói Premium rẻ nhất là 24k/tháng, hèn chi hỏi sao nó không cho Premium. Tui thấy hơi thiếu đi sự tự do rồi đấy.

{{ img_cap(src="image.png", caption="Hình ảnh của DirectAdmin giới hạn inode") }}

## Khởi đầu hành trình tìm kiếm sự tự do: WonderCMS
Không chịu nổi sự bất công ấy, tui quyết tâm không để cái gói "miễn phí" này kìm chân mình. Tui bắt đầu tìm kiếm xem gói này thực sự cung cấp cho tui những gì. Tui lục lọi các thư mục trong Free Builder đó, tui nhận ra được là trang web sử dụng PHP và Apache để quản lý nội dung. Điểm nổi bật nhất đó chính là folder đặc trưng: `public_html`

{{ img_cap(src="image-1.png", caption="Hình ảnh File Explorer của DirectAdmin") }}

Tiếp tục lục lọi 1 hồi nữa, tui phát hiện rất nhiều thứ quan trọng giúp cho tui có thể thay đổi trang web:
* FTP: Giao thức giúp trao đổi file — hiểu đơn giản là một "đường ống" nối thẳng máy tính bạn với server, cho phép bạn kéo thả file lên xuống. Tui phát hiện có 1 account FTP mà SiteProBuilder hay sử dụng để đẩy file bên họ qua trang web của tui, thế là tui lợi dụng nó để đẩy nội dung của mình lên.
* DNS[^2]: Tui có thể tự do chỉnh sửa các bản ghi DNS ở đây, bao gồm bản ghi cho email, tuy nó không được mạnh mẽ như Cloudflare lắm (ở phần sau blog này các bạn sẽ biết vì sao)
* SSL Certificate: DirectAdmin mặc định tạo cho chúng ta 1 chứng chỉ số của bên Let's Encrypt. Vấn đề là chứng chỉ lại được issue bởi 1 CA[^3] cũ đã hết hạn (cụ thể là DST Root CA X3, đã hết hạn từ 30/09/2021), chính vì vậy trang web lúc đó báo là kết nối không an toàn. Ủa anh gì đó ơi, mình cần chứng chỉ số mình đăng bài lên mà giờ trang đỏ lè như vậy rồi sao anh không chỉnh sửa? Đã vậy chương trình tặng tên miền như tui nhớ là từ thời năm 2024 rồi, sao tới 2025 mà không ai báo một cái lỗi nhỏ này vậy trời... Thôi nhờ các bạn đọc tiếp cho tui đỡ tức đi 😉. 

Khi mà tui thấy có FTP, tui bắt đầu nhảy số về CMS, một hệ quản trị nội dung mà tui có thể tự do chỉnh sửa trang web của mình hoàn toàn trên chính trang của mình, chỉ cần thiết lập tài khoản Admin, điển hình nhất là WordPress. Tui bắt đầu tìm hiểu về các loại CMS, cân đo đong đếm sao cho vừa khít cái giới hạn 1000 inode đó, và tui đã quyết định chọn [WonderCMS](https://www.wondercms.com/). Cả cái CMS đó gói gọn trong 5 files, cực kỳ nhỏ gọn để tui có thể nhét thêm nhiều thứ tui muốn. Lúc đó tui mừng lắm, nghĩ thầm: "Ngon, cuối cùng cũng tìm ra lối thoát rồi!"

{{ img_cap(src="image-4.png", caption="Trang chủ của WonderCMS") }}

## Đăng ký chứng chỉ số thay chứng chỉ tự tạo
Như tui nói ở trên thì chứng chỉ tự tạo do bên DirectAdmin cấp đã coi là không an toàn rồi. Vì vậy, tui chuyển qua nền tảng khác là ZeroSSL. ZeroSSL dùng CA khác là Sectigo để xác thực trang web và cấp chứng chỉ tốt hơn, an toàn hơn. Tuy nhiên 1 nhược điểm chính của nó là bản free của nó chỉ cung cấp cho 3 tên miền, đã vậy còn giới hạn 90 ngày 1 chứng chỉ. May sao là ACME bên DirectAdmin hỗ trợ gia hạn tên miền cho chúng ta luôn, hết hạn thì cứ để nó gia hạn là xong.

Cách làm thì cũng khá đơn giản. Nếu bạn chưa rành về cách tạo chứng chỉ số, bạn cứ dùng tính năng tạo chứng chỉ ở bên DirectAdmin, nhập các thông tin cần thiết:

{{ img_cap(src="image-7.png", caption="Các thông tin cần thiết cần nhập để tạo SSL Certificate") }}

Sau đó bạn ghi chú lại Private Key để các bạn dán vào trong mục "Paste a pre-generated certificate key", đồng thời lấy chứng chỉ self-signed ra mang vào ZeroSSL, làm theo hướng dẫn, chờ nhận chứng chỉ và dán vào mục Certificates là xong. Rất nhanh và rất đơn giản, chỉ cần 1 chút thao tác setup là xong. 

Mới đầu khi mà tui thêm chứng chỉ vào thì trang web chưa nhận đâu, phải đợi mấy ngày thì trang web đã nhận chứng chỉ và kết nối an toàn. Nhìn chung tui thấy workaround cho các vấn đề các bạn rất dễ tìm trên mạng và các chatbot, nhưng thực hành mới khó đấy, bù lại các bạn sẽ biết thêm một chút cách setup. Sau này khi các bạn thấy ôi không trang web báo không an toàn do certificate thì các bạn sẽ biết cách xử lý. Khi mà bạn biết Cloudflare làm mấy cái này tự động (mình sẽ nói sau) thì chắc chắn các bạn sẽ ghiền, nhưng biết một chút cách setup cũng tốt mà. Tui tin là các bạn sẽ làm được thôi.

## Tìm ra những bất cập của server Free Builder
Tui hào hứng bắt tay vào "tân trang" trang web với WonderCMS. Setup local, cài plugin, chỉnh giao diện — mọi thứ chạy ngon lành trên máy tui.

<details>
    <summary>Source của trang web</summary>

Tui có để source ở link sau cho các bạn có thể tìm nếu muốn: [https://drive.google.com/drive/folders/1TNkYCzvp741mQPrLSoUpbF5_7mJN9m5I?usp=sharing](https://drive.google.com/drive/folders/1TNkYCzvp741mQPrLSoUpbF5_7mJN9m5I?usp=sharing)
</details>

Sau khi hoàn thiện trang web thông qua trình chỉnh sửa của WonderCMS, tui bắt đầu đẩy file lên server thông qua FTP thông qua phần mềm FileZilla. Mọi chuyện đều bình thường, trang web chạy mượt mà, cho đến khi... lúc tui chỉnh nội dung thông qua tài khoản Admin trực tiếp trên host, mọi tiến trình đều không được lưu lại. Viết cho đã vô, xong F5 cái mất hết. Tui bắt đầu nghi ngờ về cái hosting này. Lúc đó tui ngồi nhìn nội dung bị reset từ đầu sau cú F5 mà muốn lật bàn, nó giống như bạn gõ file Word cho đã xong bạn quên bấm Ctrl + S vậy đó. Bao nhiêu nội dung đang dâng trào cảm xúc viết xong xuôi — bay sạch, hết cứu ~. Tui đau đớn, tui gục ngã...

Sau khi "hạ hỏa" và bình tĩnh lại, tui mới ngồi tìm hiểu nguyên nhân. Hóa ra vốn dĩ cái host này chỉ tối ưu cho những trang web tĩnh (có nghĩa là nội dung bên trong không tự thay đổi gì). Còn WonderCMS thì cần server chạy PHP để xử lý và lưu nội dung — nên khi tui bấm lưu trên host, server không xử lý được và dữ liệu bay mất. Nhưng việc phải chỉnh sửa từ local xong qua FTP để đẩy lên host thì lại quá lằng nhằng và cồng kềnh đối với tui. Thế là deadline các môn bên đại học dồn ép, trang web của tui đóng mạng nhện đến gần đây luôn.

## Nhìn lại trang đó có gì trước cách mạng thay đổi toàn bộ trang web
Cho các bạn thấy trang web lúc đó của tui như này:

{{ img_cap(src="image-5.png", caption="Trang chủ của trang cũ tạo bởi WonderCMS") }}

{{ img_cap(src="image-6.png", caption="Trang blog tạo bởi WonderCMS") }}

Nhìn rất xịn xò, rất đẹp, nhưng khả năng mở rộng rất hạn chế và không thể ghi nội dung mọi lúc mọi nơi... Tui nhìn lại toàn bộ hành trình: từ cái gói "miễn phí" đầy hạn chế, đến chứng chỉ SSL hết hạn, đến nội dung bay sạch sau một cú F5. Đã đủ rồi. Tui đưa ra 1 quyết định thay đổi hoàn toàn cách tui xây dựng web: sử dụng 1 trình tạo trang web mà nội dung viết bằng Markdown (rời xa WYSIWYG - What You See Is What You Get, kiểu gõ đâu hiện đó, giống Microsoft Word — tiện nhưng bị phụ thuộc hoàn toàn vào giao diện của nền tảng và khó tùy biến sâu), hoàn toàn miễn phí, xây dựng nhanh, tối ưu SEO tốt, và đặc biệt là hoàn toàn tự động hóa với GitOps[^5].

So sánh giữa 2 phiên bản:

{{ side_by_side(src1="image-5.png", caption1="Trang cũ (WonderCMS)", src2="image-8.png", caption2="Trang mới (Zola)") }}

Nhưng hành trình chưa dừng ở đây đâu. Từ việc chọn Zola, setup theme, đến chuyển DNS sang Cloudflare và viết Worker để tạo ảnh OG tự động — đó là một cuộc "cách mạng" hoàn toàn khác. Nếu bạn muốn biết trang web này đã "lột xác" như thế nào, hẹn các bạn ở phần tiếp theo nha 😉

---

[^1]: Inode là số lượng file tối đa mà bạn có thể tạo ra trên hosting. Mỗi file, thư mục, link tượng trưng, v.v... đều chiếm 1 inode. Nếu bạn tạo quá nhiều file nhỏ (ví dụ: hàng ngàn file log, cache, hoặc email), bạn có thể hết inode ngay cả khi dung lượng ổ cứng còn trống.

[^2]: DNS (Domain Name System) là hệ thống phân giải tên miền, giống như danh bạ điện thoại của Internet. Khi bạn gõ một tên miền (ví dụ: google.com) vào trình duyệt, DNS sẽ dịch tên miền đó thành địa chỉ IP (ví dụ: 172.217.160.142) để máy tính biết được cần kết nối đến máy chủ nào.

[^3]: CA (Certificate Authority) là tổ chức chuyên xác nhận danh tính trang web. Khi CA hết hạn hoặc không còn được tin tưởng, trình duyệt sẽ cảnh báo trang web không an toàn — dù bản thân trang web không có vấn đề gì.

[^5]: GitOps là một mô hình vận hành hệ thống, trong đó Git được sử dụng như một nguồn chân lý duy nhất (single source of truth) để quản lý cơ sở hạ tầng và ứng dụng. Thay vì cấu hình thủ công, mọi thay đổi được thực hiện thông qua việc cập nhật mã nguồn trong Git repository. Các công cụ GitOps sẽ tự động phát hiện thay đổi và đồng bộ hóa trạng thái mong muốn lên môi trường thực tế.