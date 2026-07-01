import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { Admin } from '../models/Admin';
import { Setting } from '../models/Setting';
import { Section } from '../models/Section';
import { Service } from '../models/Service';
import { PriceTable } from '../models/PriceTable';
import { Slider } from '../models/Slider';

dotenv.config();

const seed = async () => {
  try {
    // Connect to DB
    await connectDB();

    console.log('Clearing existing database data...');
    await Admin.deleteMany({});
    await Setting.deleteMany({});
    await Section.deleteMany({});
    await Service.deleteMany({});
    await PriceTable.deleteMany({});
    await Slider.deleteMany({});

    console.log('Seeding Admin account...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('zintaxadmin123', salt);
    
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'zintaxfinance.info@gmail.com',
      role: 'admin'
    });
    await admin.save();
    console.log('Seeded admin: username is "admin", password is "zintaxadmin123"');

    console.log('Seeding global settings...');
    const settings = new Setting({
      siteName: 'Dịch vụ kế toán chuyên nghiệp',
      siteNameZh: '专业会计服务',
      companyName: 'CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE',
      companyNameZh: 'ZINTAX FINANCE 咨询有限公司',
      email: 'zintaxfinance.info@gmail.com',
      adminEmail: 'zintaxfinance.info@gmail.com',
      phone: '0904846088',
      hotline: '0904.846.088',
      address: 'Tầng 6, tòa nhà MD Complex (Tòa VP), Số 68 Phố Nguyễn Cơ Thạch, Phường Từ Liêm, TP Hà Nội, Việt Nam',
      addressZh: '越南河内市慈廉郡美亭阮机石街68号 MD Complex大楼（办公楼）6层',
      zaloLink: 'https://zalo.me/0904846088',
      googleMapEmbed: '<iframe style="border: 0;width: 100%;height: 350px;" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9056249339343!2d105.76451641042732!3d21.036461787431267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b5dfd4b7eb%3A0xe53bc13a699c279c!2zNjggTmd1eeG7hW4gQ8ahIFRo4bqhY2gsIE3hu7kgxJDDrG5oLCBU4burIExpw6ptLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1719658765432!5m2!1svi!2s" frameborder="0" allowfullscreen=""></iframe>',
      copyright: '© 2016 - 2026 ketoanchuyennghiep.com.vn. All rights reserved',
      copyrightZh: '© 2016 - 2026 ketoanchuyennghiep.com.vn. 版权所有',
      logoUrl: '/assets/images/logo.png'
    });
    await settings.save();

    console.log('Seeding sliders...');
    const sliders = [
      {
        imageUrl: '/assets/images/anhbia1.jpg',
        altText: 'Dịch Vụ Kế Toán Chuyên Nghiệp',
        altTextZh: '专业会计服务',
        link: '#lien-he',
        order: 1
      },
      {
        imageUrl: '/assets/images/hinh_anh_bia_2.png',
        altText: 'Kế toán trọn gói giá tốt',
        altTextZh: '全套会计服务，价格优惠',
        link: '#bang-gia',
        order: 2
      }
    ];
    await Slider.insertMany(sliders);

    console.log('Seeding services (6 boxes)...');
    const services = [
      {
        title: 'Dịch vụ dọn dẹp sổ sách kế toán',
        titleZh: '账簿整理服务',
        description: 'Kế toán tổng hợp cho doanh nghiệp đảm bảo bảo mật, chính xác',
        descriptionZh: '企业总账，确保安全、准确',
        iconUrl: '/assets/images/icon.webp',
        link: '#don-dep-so-sach',
        order: 1
      },
      {
        title: 'Dịch vụ hoàn thuế',
        titleZh: '退税服务',
        description: 'Tư vấn tài chính hiệu quả cho các doanh nghiệp về thuế, hóa đơn…',
        descriptionZh: '为企业提供关于税收、发票等高效财务咨询',
        iconUrl: '/assets/images/icon-tu-van.webp',
        link: '#lien-he',
        order: 2
      },
      {
        title: 'Dịch vụ hoàn thuế TNCN',
        titleZh: '个人所得税退税服务',
        description: 'Quyết toán thuế nhanh gọn nhẹ cuối năm',
        descriptionZh: '年终快速简便的税收结算',
        iconUrl: '/assets/images/icon-quyet-toan-thue.webp',
        link: '#lien-he',
        order: 3
      },
      {
        title: 'Dịch vụ báo cáo tài chính',
        titleZh: '财务报表服务',
        description: 'Dịch vụ báo cáo tài chính cho công ty chính xác và chuyên nghiệp nhất',
        descriptionZh: '为公司提供最精准、最专业的财务报表服务',
        iconUrl: '/assets/images/icon-bao-cao-tai-chinh.webp',
        link: '#bao-cao-tai-chinh',
        order: 4
      },
      {
        title: 'Báo cáo thuế hàng tháng',
        titleZh: '每月税务申报',
        description: 'Dịch vụ báo cáo thuế hàng tháng cặn cẽ và bảo mật nhất! Giải quyết nỗi lo…',
        descriptionZh: '详细且最保密的每月税务申报服务！解决您的担忧…',
        iconUrl: '/assets/images/bao-cao-thue-hang-thang.webp',
        link: '#lien-he',
        order: 5
      },
      {
        title: 'Dịch vụ đào tạo kế toán',
        titleZh: '会计培训服务',
        description: 'Nhận đào tạo kế toán chuyên nghiệp cho các doanh nghiệp',
        descriptionZh: '承接企业专业会计培训',
        iconUrl: '/assets/images/icon-day-ke-toan.webp',
        link: '#lien-he',
        order: 6
      }
    ];
    await Service.insertMany(services);

    console.log('Seeding price tables...');
    const pricingTables = [
      {
        sectionId: 'bang-gia',
        tableName: 'BẢNG GIÁ DỊCH VỤ KẾ TOÁN TRỌN GÓI',
        tableNameZh: '全套会计服务价格表',
        subHeader: 'Không phát sinh hóa đơn giá từ 300-500k/1 tháng',
        subHeaderZh: '无发票，价格 300k - 500k/月起',
        rows: [
          {
            invoiceRange: 'Dưới 5',
            invoiceRangeZh: '5张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '500.000 – 1.000.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.000.000 – 1.300.000 VND' }
            ]
          },
          {
            invoiceRange: 'Từ 5-20',
            invoiceRangeZh: '5-20张',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.100.000-1.500.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.100.000-2.000.000 VND' }
            ]
          },
          {
            invoiceRange: 'Từ 21- 50',
            invoiceRangeZh: '21-50张',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '2.000.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '2.500.000 VND' }
            ]
          },
          {
            invoiceRange: 'Dưới 90',
            invoiceRangeZh: '90张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '3.000.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '3.500.000 VND' }
            ]
          }
        ],
        contactRow: {
          label: 'Từ 91 trở lên',
          labelZh: '91张以上',
          contactInfo: 'Ms Yên - 0904.846.088',
          contactInfoZh: 'Ms Yen - 0904.846.088'
        }
      },
      {
        sectionId: 'bao-cao-tai-chinh',
        tableName: 'BẢNG GIÁ DỊCH VỤ LÀM BÁO CÁO TÀI CHÍNH',
        tableNameZh: '财务报表服务价格表',
        subHeader: '',
        subHeaderZh: '',
        rows: [
          {
            invoiceRange: 'Dưới 16',
            invoiceRangeZh: '16张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '500.000 – 1.000.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.000.000 – 1.300.000 VND' }
            ]
          },
          {
            invoiceRange: 'Dưới 31',
            invoiceRangeZh: '31张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.100.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.500.000 VND' }
            ]
          },
          {
            invoiceRange: 'Dưới 50',
            invoiceRangeZh: '50张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.500.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '1.800.000 VND' }
            ]
          },
          {
            invoiceRange: 'Dưới 90',
            invoiceRangeZh: '90张以下',
            fields: [
              { sector: 'Thương mại, dịch vụ, tư vấn', sectorZh: '贸易、服务、咨询', price: '1.800.000 VND' },
              { sector: 'Xây dựng, sản xuất, gia công, lắp đặt, nhà hàng', sectorZh: '建筑、生产、加工、安装、餐饮', price: '2.300.000 VND' }
            ]
          }
        ],
        contactRow: {
          label: 'Từ 91 trở lên',
          labelZh: '91张以上',
          contactInfo: 'Ms Yên - 0904.846.088',
          contactInfoZh: 'Ms Yen - 0904.846.088'
        }
      }
    ];
    await PriceTable.insertMany(pricingTables);

    console.log('Seeding page sections...');
    const sections = [
      {
        sectionId: 'bang-gia',
        title: 'Dịch Vụ Kế Toán Trọn Gói',
        titleZh: '全套会计服务',
        content: `<p><span style="color: #ed1c24;"><strong>Dịch vụ kế toán thuế trọn Gói giá rẻ</strong>&nbsp;–&nbsp;</span><strong><span style="color: #ed1c24;">dịch vụ báo cáo thuế tháng, quý</span>&nbsp;</strong> trọn gói của <span class="company-name-placeholder"><strong>CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</strong></span> với mức chi phí chỉ từ <strong>500.000 – 5&nbsp;triệu/tháng</strong>&nbsp;cam kết chất lượng uy tín và bảo mật thông tin Tại sao quý doanh nghiệp nên lựa chọn dịch vụ kế toán trọn gói và những khó khăn của doanh nghiệp:</p>
<p><span style="color: #ed1c24;"><strong>Nội dung gói dịch vụ kế toán trọn gói:</strong></span></p>
<p>– Cân đối, Tư vấn việc sử dụng hóa đơn đầu vào, đầu ra hợp lý.</p>
<p>– Nhận hóa, đơn chứng kế toán từ tận nơi hoặc qua email, zalo.</p>
<p>– Phân loại, kiểm tra tính hợp lệ của chứng từ gốc,&nbsp;</p>
<p>– Lập tờ khai báo cáo thuế hàng tháng, hàng quý, khai báo thuế TNCN, báo cáo tình hình sử dụng hóa đơn, tạm tính thuế TNDN.</p>
<p>– Nộp báo cáo thuế lên cơ quan thuế theo quy định.</p>
<p>– Hoàn thiện chứng từ và lập sổ sách kế toán</p>
<p>– Lập các chứng từ kế toán: Nhập, xuất, thu,chi;</p>
<p>– Lập các sổ chi tiết tính giá thành sản phẩm, sổ kho hàng hoá, phải thu, phải trả;</p>
<p>– Lập các mẫu biểu phân bổ, khấu hao…theo quy định</p>
<p>– Lập bảng lương, các mẫu biểu liên quan đến lao động.</p>
<p>– Lập sổ cái các tài khoản</p>
<p>– Lập sổ nhật ký chung</p>
<p>– Lập quyết toán thuế TNDN, TNCN.</p>
<p>– Lập báo cáo tài chính cuối năm</p>
<p>– Lập và in sổ kế toán theo quy định của Bộ tài chính.</p>
<p>– Tổ chức lưu trữ hồ sơ kế toán.</p>
<p>– Có trách nhiệm giải trình với cơ quan thuế khi đến kỳ quyết toán.</p>
<p><span style="color: #ed1c24;"><strong>Khách hàng cần cung cấp gì khi sử dụng dịch vụ kế toán trọn gói của&nbsp;<span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span></strong></span></p>
<p>– Cung cấp hóa đơn đầu vào, đầu ra ( Hóa đơn gốc hoặc photo )</p>
<p>– Thiết bị chữ ký số để nộp báo báo thuế qua mạng.</p>`,
        contentZh: `<p><span style="color: #ed1c24;"><strong>廉价全套税务会计服务</strong>&nbsp;–&nbsp;</span><strong><span style="color: #ed1c24;">由<span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span>提供的全套月度、季度税务申报服务</span>&nbsp;</strong>，费用仅从<strong>500.000 – 5.000.000 越南盾/月起</strong>&nbsp;，承诺质量信誉与信息保密。为什么企业应该选择全套会计服务以及企业面临的困难：</p>
<p><span style="color: #ed1c24;"><strong>全套会计服务包内容：</strong></span></p>
<p>– 衡算、咨询合理使用进项和销项发票。</p>
<p>– 亲自或通过电子邮件、Zalo接收会计发票和单据。</p>
<p>– 分类、检查原始单据的合规性。</p>
<p>– 编制月度、季度税务申报表、个人所得税申报、发票使用情况报告、企业所得税暂估。</p>
<p>– 按照规定向税务机关递交税务报告。</p>
<p>– 完善单据并建立会计账簿。</p>
<p>– 编制会计凭证：入库、出库、收款、付款。</p>
<p>– 编制产品成本明细账、商品库存账、应收账款、应付账款。</p>
<p>– 按照规定编制折旧、分摊等明细表。</p>
<p>– 编制工资表及与劳动相关的报表。</p>
<p>– 编制各科目总账。</p>
<p>– 编制日记账。</p>
<p>– 编制企业所得税、个人所得税汇算清缴。</p>
<p>– 编制年终财务报表。</p>
<p>– 按照财政部规定编制并打印会计账簿。</p>
<p>– 组织会计档案归档与保存。</p>
<p>– 负责在税务稽查期向税务机关进行解释和说明。</p>
<p><span style="color: #ed1c24;"><strong>客户在使用<span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span>的全套会计服务时需要提供什么：</strong></span></p>
<p>– 提供进项、销项发票（原件或复印件）。</p>
<p>– 数字证书设备（Token），以便通过网络提交税务申报。</p>`,
        order: 1
      },
      {
        sectionId: 'gioi-thieu',
        title: 'CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE',
        titleZh: 'ZINTAX FINANCE 咨询有限公司',
        content: `<p style="font-size: 1.125rem; font-weight: 500; text-align: center; color: #374151; margin-bottom: 1rem;">Chuyên cung cấp dịch vụ kế toán, thuế và tư vấn doanh nghiệp cho doanh nghiệp FDI Trung Quốc tại Việt Nam</p>
<p>Tại ZINTAX FINANCE, chúng tôi tin rằng sự phát triển của khách hàng cũng chính là sự phát triển của chúng tôi. Với phương châm "Growing Together – Cùng nhau phát triển", chúng tôi luôn đồng hành cùng các doanh nghiệp FDI Trung Quốc trong suốt quá trình đầu tư và hoạt động tại Việt Nam.</p>
<p>Chúng tôi hiểu rõ những khó khăn mà doanh nghiệp nước ngoài thường gặp phải như khác biệt về ngôn ngữ, hệ thống pháp luật, chính sách thuế, chế độ kế toán và các thủ tục hành chính. Chính vì vậy, ZINTAX FINANCE không chỉ cung cấp dịch vụ kế toán mà còn mang đến những giải pháp tư vấn toàn diện, giúp doanh nghiệp vận hành hiệu quả, tuân thủ pháp luật và giảm thiểu rủi ro.</p>
<p>Với đội ngũ chuyên môn giàu kinh nghiệm, sử dụng thành thạo tiếng Trung và am hiểu môi trường đầu tư tại Việt Nam, chúng tôi luôn chủ động hỗ trợ khách hàng từ khi thành lập doanh nghiệp đến quá trình vận hành, kê khai thuế, lập báo cáo tài chính, quyết toán thuế và tư vấn các vấn đề phát sinh.</p>
<p><strong>Chúng tôi cam kết mang đến dịch vụ:</strong></p>
<ul style="list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
  <li><strong>Chuyên nghiệp</strong> – Thực hiện chính xác, đúng quy định.</li>
  <li><strong>Đồng hành</strong> – Luôn sát cánh cùng doanh nghiệp trong mọi giai đoạn phát triển.</li>
  <li><strong>An tâm</strong> – Chủ động kiểm soát và giảm thiểu rủi ro về kế toán, thuế và pháp lý.</li>
  <li><strong>Hiệu quả</strong> – Tối ưu chi phí quản lý và giúp doanh nghiệp tập trung phát triển hoạt động kinh doanh.</li>
</ul>
<p>Growing Together không chỉ là khẩu hiệu mà còn là cam kết của ZINTAX FINANCE trong việc xây dựng mối quan hệ hợp tác lâu dài, trở thành đối tác tin cậy của các doanh nghiệp Trung Quốc tại Việt Nam.</p>`,
        contentZh: `<p style="font-size: 1.125rem; font-weight: 500; text-align: center; color: #374151; margin-bottom: 1rem;">专注为越南中国FDI企业提供会计、税务及企业咨询服务</p>
<p>在 ZINTAX FINANCE，我们始终相信，客户的发展就是我们的发展。秉承 "Growing Together（共同成长）" 的理念，我们致力于陪伴中国FDI企业在越南投资、运营和发展的每一个阶段，为企业提供专业、高效、值得信赖的财税服务。</p>
<p>我们深知，中国企业进入越南市场时，往往会面临语言沟通、法律法规、税务政策、会计制度以及行政手续等方面的挑战。因此，ZINTAX FINANCE不仅提供专业的会计服务，更为企业提供全面的财税咨询解决方案，帮助企业规范运营、依法合规、有效降低经营风险。</p>
<p>凭借经验丰富的专业团队、流利的中文沟通能力以及对越南投资环境和法律法规的深入了解，我们能够为客户提供从公司设立、日常会计处理、税务申报、财务报表编制、年度税务结算，到企业经营过程中各类财税咨询的一站式服务。</p>
<p><strong>我们的服务承诺：</strong></p>
<ul style="list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
  <li>✔ <strong>专业可靠</strong> —— 严格遵循越南法律法规，确保每一项工作准确、规范。</li>
  <li>✔ <strong>全程陪伴</strong> —— 与企业共同成长，为企业不同发展阶段提供持续支持。</li>
  <li>✔ <strong>安心无忧</strong> —— 主动识别并降低财税及法律风险，让企业专注于核心业务发展。</li>
  <li>✔ <strong>高效务实</strong> —— 优化企业管理成本，提高运营效率，为企业创造更大价值。</li>
</ul>
<p>"Growing Together（共同成长）" 不仅是 ZINTAX FINANCE 的品牌理念，更是我们对每一位客户的郑重承诺。我们期待成为中国企业在越南长期、值得信赖的财税合作伙伴，与客户携手成长，共创未来。</p>`,
        order: 2
      },
      {
        sectionId: 'thanh-lap-cong-ty',
        title: 'Dịch vụ thành lập công ty',
        titleZh: '公司注册服务',
        content: `<p>Dịch vụ Thành Lập Công Ty trọn gói uy tín giá rẻ tại Hà Nội, Hải Phòng, Bắc Ninh, Hải Dương&nbsp;<span class="company-name-placeholder"><strong>CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</strong></span>&nbsp;Là một trong những công ty hàng đầu về mảng dịch vụ thành lập công ty&nbsp;và&nbsp; dịch vụ kế toán&nbsp;, bởi đội ngũ luật sư chuyên nghiệp và đội ngũ kế toán trưởng nhiều năm kinh nghiệm trực tiếp đảm nhận do vậy khi lựa chọn gói dịch vụ thành lập doanh nghiệp của chúng tôi quý doanh nghiệp có thể yên tâm về dịch vụ nhanh gọn- hồ sơ giải quyết nhanh nhất không những thế chúng tôi sẽ tư vấn về mảng kế toán cho doanh nghiệp khi bắt đầu hoạt động, nếu quý doanh nghiệp lựa chọn gói dịch vụ thành lập công ty thì&nbsp;<span class="company-name-placeholder"><strong>CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</strong></span>&nbsp;sẽ miễn phí hỗ trợ tư vấn các thủ tục ban đầu về thuế và kế toán cho quý doanh nghiệp</p>
<p><span style="color: #ed1c24;"><strong><span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span></strong></span>&nbsp;không chỉ nhận làm dịch vụ thành lập công ty tại Hà Nội&nbsp;mà ngoài ra còn nhận làm tại các tỉnh như Hải Phòng,Bắc Ninh,Hải Dương&nbsp;với nhiều năm kinh nghiệm trong tư vấn thành lập doanh nghiệp tư nhân và đội ngũ nhân viên giỏi, chúng tôi sẽ giúp quý khách tiết kiệm chi phí, thời gian và chất lượng dịch vụ tốt nhất khi đăng ký sử dụng dịch vụ chúng tôi.</p>
<p>Ngoài ra chúng tôi tiếp nhận dịch vụ thành lập công ty tại&nbsp;Đông Anh,Gia Lâm,Hoài Đức,Mê Linh,Mỹ Đức,Phú Xuyên,Phúc Thọ,Quốc Oai,Sóc Sơn,Thạch Thất,Thanh Oai,Thanh Trì,,Thường Tín,Ứng Hòa,&nbsp;Ba Đình,Từ Liêm,Cầu Giấy,Đống Đa,Hà Đông,Hai Bà Trưng,Hoàn Kiếm,Hoàng Mai,Long Biên,Tây Hồ,Thanh Xuân,Chương Mỹ,Đan Phượng.</p>
<p><span style="color: #ed1c24;"><strong>Nội dung dịch vụ thành lập công ty:</strong></span></p>
<p>Trước tiên chúng tôi tiếp nhận thông tin của quý khách</p>
<p>– Lấy thông tin theo yêu cầu gồm&nbsp;</p>
<p>&nbsp;Hồ sơ thành lập công ty</p>
<p>– Soạn hồ sơ thành lập, soạn thảo hoàn thiện hồ sơ đăng ký kinh doanh</p>
<p>– Đại diện khách hàng nộp hồ sơ thành lập công ty tại Sở kế hoạch và Đầu tư;</p>
<p>– Đại diện theo dõi tiến trình xử lý và thông báo kết quả nộp hồ sơ cho khách hàng;</p>
<p>– Đại diện theo dõi hồ sơ và trả lời của Sở kế hoạch và Đầu tư, thông báo kết quả cho khách hàng;</p>
<p>– Đại diện nhận Giấy phép kinh doanh tại Sở Kế Hoạch và Đầu Tư cho khách hàng;</p>
<p>–&nbsp; Đại diện theo ủy quyền cho khách hàng thực hiện việc đăng ký kinh doanh tại Cơ quan nhà nước có thẩm quyền trong việc xin phép thành lập công ty, xin cấp con dấu và mã số thuế cho doanh nghiệp.</p>
<p>Trong suốt quá trình làm thủ tục dịch vụ thành lập công ty&nbsp;chỉ duy nhất một lần người đại diện theo pháp luật của công ty/doanh nghiệp đi đến cơ quan công an để làm thủ tục nhận dấu pháp nhân của công ty/ doanh nghiệp mình ( chúng tôi sẽ liên hệ báo trước ngày, giờ cụ thể để đỡ mất thời gian của quý khách). Mọi việc tiếp xúc khác với cơ quan nhà nước chúng tôi thay mặt quý khách để làm việc với họ.</p>
<p><span style="color: #ed1c24;"><strong>Kết quả của dịch vụ thành lập công ty quý khách sẽ nhận được</strong></span></p>
<p>– Giấy chứng nhận đăng ký doanh nghiệp</p>
<p>– Giấy chứng nhận mẫu dấu do cơ quan công an cấp</p>
<p>– Dấu tròn công ty</p>
<p>– Giấy chứng nhận mã số xuất nhập khẩu</p>
<p>– Điều lệ, hồ sơ nội bộ công ty</p>
<p>Trong trường quý khách hàng chưa có người làm kế toán chúng tôi sẽ hướng dẫn kỹ cách kê khai thuế hàng tháng và hàng quý để công ty chủ động trong việc kê khai thuế ( Tránh vướng mắc không đáng có khi làm việc với cơ quan thuế ).</p>
<p><span style="color: #ed1c24;"><strong>Quý khách hàng cần cung cấp:</strong></span></p>
<p>– Cung cấp thông tin (tên công ty, địa chỉ công ty, ý tưởng ngành nghề…) các thông tin chúng tôi sẽ tư vấn cùng khách hàng.</p>
<p>–&nbsp; Chỉ cần chứng CMND hoặc hộ chiếu của thành viên góp vốn</p>
<p><span style="color: #ed1c24;"><strong>Cam kết của <span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span> sau dịch vụ thành lập công ty – Thành lập doanh nghiệp:</strong></span></p>
<p>– Hỗ trợ Tư vấn hoàn thiện hồ sơ nội bộ của doanh nghiệp sau khi thành lập doanh nghiệp;</p>
<p>– Hỗ trợ Tư vấn cho doanh nghiệp cần phải tiến hành các thủ tục pháp lý gì sau khi thành lập doanh nghiệp;</p>
<p>– Cung cấp văn bản pháp luật trong lĩnh vực hoạt động cho các doanh nghiệp sau thành lập.</p>
<p>Ngoài dịch vụ thành lập công ty chúng tôi còn cung cấp các gói:</p>
<p><span style="color: #ed1c24;"><strong>Gói 1:&nbsp; Tư vấn thành lập mới Công ty</strong></span></p>
<p>– Công ty TNHH 1 thành viên</p>
<p>... (omitted) ...</p>
<p><span style="color: #ed1c24;"><strong>Chi phí thực hiện Dịch vụ Thành lập công ty:</strong></span></p>
<p>DỊCH VỤ THÀNH LẬP CÔNG TY</p>
<p>Giải pháp an toàn, hoàn hảo cho doanh nghiệp&nbsp;</p>
<p>&nbsp;CHỈ TỪ 1.000.000đ ĐẾN 3.000.000đ</p>`,
        contentZh: `<p>在河内、海防、北宁、海阳提供信誉良好、价格实惠的全套公司注册服务&nbsp;<span class="company-name-placeholder"><strong>ZINTAX FINANCE 咨询有限公司</strong></span>&nbsp;是公司注册及会计服务领域的领先公司之一，由专业律师团队和多年经验的会计师长直接负责。因此，当选择我们的企业成立服务包时，贵企业可以放心，服务快捷，档案解决最快。不仅如此，在企业开始运营时，我们还会为企业提供会计方面的咨询。如果贵企业选择公司注册服务包，&nbsp;<span class="company-name-placeholder"><strong>ZINTAX FINANCE 咨询有限公司</strong></span>&nbsp;将免费协助咨询企业初期的税务和会计手续。</p>
<p><span style="color: #ed1c24;"><strong><span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span></strong></span>&nbsp;不仅在河内承接公司注册服务，还在海防、北宁、海阳等省份承接。凭借在私营企业成立咨询方面的多年经验和优秀员工团队，我们将在客户登记使用我们的服务时，帮助客户节省成本、时间和享受最佳服务质量。</p>
<p>此外，我们在东英、嘉林、怀德、迷林、美德、富川、福寿、国威、朔山、石室、青威、青池、常信、应和、巴亭、慈廉、纸桥、栋多、河东、二征夫人、还剑、黄梅、龙编、西湖、青春、章美、丹凤等地接单公司注册服务。</p>
<p><span style="color: #ed1c24;"><strong>公司注册服务内容：</strong></span></p>
<p>首先我们接收贵客户的信息</p>
<p>– 按照要求获取信息，包括：</p>
<p>&nbsp;公司注册档案</p>
<p>– 撰写注册档案，撰写完善工商登记档案；</p>
<p>– 代表客户向计划投资厅提交公司注册档案；</p>
<p>– 代表跟踪处理进度并通知客户提交档案结果；</p>
<p>– 代表跟踪计划投资厅的档案和回复，通知客户结果；</p>
<p>– 代表客户前往计划投资厅领取营业执照；</p>
<p>– &nbsp;代表授权客户在国家有权机关办理登记注册、申领企业印章和税号的手续。</p>
<p>在办理公司注册服务手续的整个过程中，仅需公司/企业的法定代表人亲自前往公安机关办理领取公司/企业法人印章的手续一次（我们会提前联系告知具体日期、时间，以免耽误您的宝贵时间）。其他所有与国家机关的接触，我们都将代表您进行沟通与工作。</p>
<p><span style="color: #ed1c24;"><strong>贵客户将收到的公司注册服务结果：</strong></span></p>
<p>– 企业登记证书（营业执照）</p>
<p>– 公安机关核发的印章样张证明书</p>
<p>– 公司圆形印章</p>
<p>– 进出口代码证书</p>
<p>– 公司章程、公司内部档案</p>
<p>如果客户还没有会计人员，我们将指导如何进行月度、季度税务申报，以便公司主动进行税务申报（避免在与税务机关工作时发生不必要的麻烦）。</p>
<p><span style="color: #ed1c24;"><strong>贵客户需要提供：</strong></span></p>
<p>– 提供信息（公司名称、公司地址、经营范围构想...），这些信息我们将与客户共同商讨咨询。</p>
<p>– &nbsp;仅需出资成员的身份证或护照复印件</p>
<p><span style="color: #ed1c24;"><strong><span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span>在公司注册/企业成立服务后的承诺：</strong></span></p>
<p>– 协助咨询完善企业成立后的内部档案；</p>
<p>– 协助咨询企业在成立后需要办理哪些法律手续；</p>
<p>– 为成立后的企业提供其活动领域的法律文件。</p>
<p>除了公司注册服务，我们还提供以下服务包：</p>
<p><span style="color: #ed1c24;"><strong>服务包 1：&nbsp;新设公司咨询</strong></span></p>
<p>– 独资有限责任公司</p>
<p>...（略）</p>
<p><span style="color: #ed1c24;"><strong>公司注册服务费用：</strong></span></p>
<p>公司注册服务</p>
<p>为企业提供安全、完美的解决方案&nbsp;</p>
<p>&nbsp;仅从 1.000.000đ 至 3.000.000đ</p>`,
        order: 3
      },
      {
        sectionId: 'don-dep-so-sach',
        title: 'Dịch Vụ Dọn Dẹp Sổ Sách Kế Toán',
        titleZh: '账簿整理服务',
        content: `<p><span style="color: #ed1c24;"><strong>Dịch vụ dọn dẹp sổ sách kế toán rà soát số sách giá chỉ từ 500.000 – 1.500.000VND/tháng tùy từng hồ sơ</strong></span></p>
<p>Tại sao doanh nghiệp lựa chọn dịch vụ dọn dẹp sổ sách kế toán: – Hệ thống sổ sách, chứng từ chứa nhiều sai xót. Nguyên nhân là do không kịp thời cập nhật các thông tư, chính xác của cơ quan thuế và bộ tài chính. – Hệ thống chứng từ thiếu xót, bị mất mát, lộn xộn và không hợp mà chủ doanh nghiệp và kế toán của doanh nghiệp không hề biết. – Sự không chính xác hay không khớp nhau trong những sổ sách kế toán. Số liệu được làm ko chi tiết cụ thể và chứa nhiều điều bất hợp lý. – Việc dọn dẹp hoàn thiện sổ sách kế toán chưa được quan tâm đúng mức – Những vấn đề trong thực trạng trên sẽ dẫn đến doanh nghiệp có nguy cơ bị cơ quan thuế xử phạt rất nặng khi đến kỳ quyết toán thuế nếu như chưa kịp thời hoàn thiện sổ sách kế toán. – Từ thực trạng trên,&nbsp;<span style="color: #ed1c24;"><strong><span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span></strong></span>&nbsp;giới thiệu quý doanh nghiệp&nbsp;<span style="color: #ed1c24;"><strong>Gói dịch vụ dọn dẹp sổ sách kế toán</strong></span>&nbsp;để giúp quý doanh nghiệp tạo dựng hệ thống sổ sách kế toán chuyên nghiệp và chính xác và sẵn sàng quyết toán thuế bất cứ lúc nào.</p>
<p><span style="color: #ed1c24;"><strong>Nội dung dịch vụ dọn dẹp sổ sách kế toán:</strong></span></p>
<p>– Kiểm tra, rà soát lại toàn bộ chứng từ kế toán cũ</p>
<p>– Làm chứng từ, sổ sách giải trình theo Báo cáo tài chính đã nộp thuế.</p>
<p>– Lập sổ sách Nhật ký chung sao cho số liệu khớp đúng với Báo cáo tài chính đã nộp thuế.</p>
<p>– Lập sổ chi tiết các tài khoản phát sinh trong năm đã khai báo nộp thuế.</p>
<p>– Lập bộ chứng từ thanh toán bao gồm: Chứng từ thu – chi, Chứng từ nhập – xuất kho vật tư, ….</p>
<p>– Chứng từ lương: Bảng chấm công, bảng lương, hồ sơ lao động liên quan.</p>
<p>– Lập các sổ chi tiết tùy theo lĩnh vực hoạt động của doanh nghiệp như: Sổ chi tiết công nợ, sổ chi tiết vật tư, hàng hóa, Sổ chi tiết bán hàng; Sổ chi tiết công trình đối với công ty thuộc lĩnh vực xây dựng; Bảng tính giá thành chi tiết theo sản phẩm đối với công ty hoạt động lĩnh vực sản xuất.</p>
<p>– Kiểm tra, các chứng từ kế toán để phát hiện các sai sót so với quy định và điều chỉnh. – Hoàn thiện sổ sách kế toán theo chuẩn mực.</p>
<p>– In, sao lưu toàn bộ chứng từ kế toán trọn gói được lập.</p>
<p>– Thẩm định lại báo cáo tài chính và điều chỉnh theo luật thuế.</p>
<p>– Chịu trách nhiệm giải trình khi doanh nghiệp quyết toán thực tế</p>
<p>– Đảm bảo tính bảo mật, thống nhất hệ thống thông tin trên Báo cáo tài chính đúng chuẩn mực kế toán và thuế.</p>
<p>Trong quá trình thực hiện dịch vụ dọn dẹp sổ sách kế toán, chúng tôi sẽ giải đáp mọi thắc mắc và tư vấn cho quý khách hàng thực hiện các quy định của pháp luật liên quan đến các luật thuế, các quy định về kế toán, quy định về hóa đơn chứng từ và luật pháp trong kinh doanh đảm bảo doanh nghiệp thực hiện phù hợp với các quy định của pháp luật.</p>`,
        contentZh: `<p><span style="color: #ed1c24;"><strong>会计账簿清理、账簿核对服务，价格仅从 500,000 – 1,500,000 越南盾/月起（具体取决于每份档案）</strong></span></p>
<p>为什么企业选择账簿清理服务： – 账簿和凭证系统存在许多错误。原因是没有及时更新财政部和总税务局的通知与政策。 – 凭证系统不全、丢失、混乱且不合规，而企业主和企业的会计却完全不知情。 – 会计账簿中数据不准确或不一致。数据编制不具体、不详细，存在很多不合理之处。 – 会计账簿的整理和完善工作未得到应有的重视。 – 上述实际情况中的问题，将导致企业在面临税务稽查时，如果未能及时完善会计账簿，可能会被税务机关处以重罚。 – 针对上述实际情况，&nbsp;<span style="color: #ed1c24;"><strong><span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span></strong></span>&nbsp;特向贵企业介绍&nbsp;<span style="color: #ed1c24;"><strong>全套账簿清理服务包</strong></span>&nbsp;，以帮助贵企业建立专业、准确的会计账簿系统，随时准备应对税务稽查。</p>
<p><span style="color: #ed1c24;"><strong>账簿清理服务内容：</strong></span></p>
<p>– 检查、核对所有旧会计凭证</p>
<p>– 根据已提交的财务报表重新编制会计凭证、账簿并进行解释说明。</p>
<p>– 编制日记账，使数据与已申报的财务报表完全一致。</p>
<p>– 针对申报纳税的年度，编制所发生的各科目的明细账。</p>
<p>– 建立全套付款凭证，包括：收付款凭证、材料入库和出库凭证等。</p>
<p>– 工资凭证：考勤表、工资单及相关的劳动档案。</p>
<p>– 根据企业的业务领域编制各种明细账，如：往来明细账、物资商品明细账、销售明细账；针对建筑工程类企业编制工程成本明细账；针对生产类企业编制按产品划分的成本计算表。</p>
<p>– 检查会计凭证，发现与规定不符的错误并予以调整。 – 按照准则完善会计账簿。</p>
<p>– 打印并备份所建立的全部会计凭证。</p>
<p>– 重新评估财务报表并根据税法进行调整。</p>
<p>– 在企业进行实际税务审计时负责解释说明。</p>
<p>– 确保财务报表上的信息保密、统一，符合会计准则和税法。</p>
<p>在实施账簿清理服务的过程中，我们将解答贵客户的所有疑问，并就有关税法、会计规定、发票凭证规定以及商业法规的执行向客户提供咨询，确保企业符合法律规定。</p>`,
        order: 4
      },
      {
        sectionId: 'bao-cao-tai-chinh',
        title: 'Dịch Vụ Báo Cáo Tài Chính',
        titleZh: '财务报表服务',
        content: `<p>Chuẩn bị đến kỳ phải nộp báo cáo tài chính công ty bạn chưa tìm được đơn vị làm dịch vụ báo cáo tài chính uy tín chuyên nghiệp ? Công ty bạn đang lo lắng với một mớ hóa đơn sổ sách chứng từ và chưa an tâm về báo cáo tài chính mà kế toán đang thuê để làm?</p>
<p>Hãy liên hệ ngay&nbsp;<span style="color: #ed1c24;"><strong><span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span></strong></span>&nbsp;lựa chọn an tâm nhất bởi đội ngũ kế toán trưởng trên 10 năm kinh nghiệm và đã có chứng chỉ hành nghề do tổng cục thuế ban hành đã và đang làm kế toán, kiểm toán báo cáo tài chính cho rất nhiều doanh nghiệp, từng làm dịch vụ báo cáo tài chính và đã quyết toán cho hơn 1000 doanh nghiệp tại Hà Nội chính thế chúng tôi có thể xử lý tất cả các loại hình doanh nghiệp thương mai, dịch vụ, sản xuất, xây lắp, nhà hàng khách sạn, vận tải, tất cả các các loại hình công ty khác kể cả các công ty vốn đầu tư nước ngoài. Không chỉ đảm nhận dịch vụ báo cáo tài chính cho các doanh nghiệp <span class="company-name-placeholder">CÔNG TY TNHH TƯ VẤN ZINTAX FINANCE</span> còn chuyên làm các gói dịch vụ kế toán trọn gói, dọn dẹp rà soát sổ sách, quyết toán thuế, hoàn thuế GTGT – XNK, kể cả dịch vụ kiểm toán báo cáo tài chính cho doanh nghiệp.</p>
<p><span style="color: #ed1c24;"><strong>Nội dung của gói dịch vụ làm báo cáo tài chính:</strong></span></p>
<p>– Thu thập các hóa đơn, chứng từ, sổ sách của doanh nghiệp;</p>
<p>– Thu thập thông báo về chế độ, hình thức kế toán áp dụng, phương pháp khấu hao TSCĐ;</p>
<p>– Khảo sát tình hình thực tế, quy trình hoạt động của doanh nghiệp;</p>
<p>– Rà soát chứng từ, sổ sách kế toán, phân loại và sắp xếp chứng từ;</p>
<p>– Lọai bỏ, điều chỉnh, chỉnh sửa các chứng từ không phù hợp;</p>
<p>– Lập các bảng phân bổ công cụ, dụng cụ, phí trả trước, phí chờ kết chuyển;</p>
<p>– Kiểm tra chi phí lương, BHYT, BHXH…</p>
<p>– Tính và lập các bảng khấu hao tài sản cố định;</p>
<p>– Hạch toán kế toán trên phần mềm kế toán chuyên nghiệp;</p>
<p>– Kết chuyển, tổng hợp thông tin để lập sổ sách kế toán, báo cáo tài chính, kết quả kinh doanh, thuyết minh báo cáo tài chính;</p>
<p>– Bàn luận với doanh nghiệp các nội dung, nghiệp vụ có liên tưởng đến kết quả thực hiện;</p>
<p>– In báo cáo tài chính, sổ sách kế toán theo quy định;</p>
<p>– Tư vấn cho doanh nghiệp các nội dung có liên quan trong quá trình tổng hợp thông tin để lập báo cáo tài chính.</p>`,
        contentZh: `<p>临近财务报表申报期，您的公司是否尚未找到信誉良好、专业的财务报表服务单位？您的公司是否正为一大堆发票、单据和账簿感到焦虑，对所聘请的会计编制的财务报表感到不放心？</p>
<p>请立即联系&nbsp;<span style="color: #ed1c24;"><strong><span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span></strong></span>&nbsp;，这是您最安心的选择。我们的首席会计师团队拥有10年以上的经验，并持有总税务局颁发的执业资格证书。我们已经并在为许多企业提供会计和财务报表审计工作，曾为河内的1000多家企业提供财务报表服务并完成税务审计。因此，我们能够处理所有类型的企业：贸易、服务、生产、建筑安装、餐饮酒店、运输，以及所有其他类型的公司，包括外资企业。不仅承接企业的财务报表服务，&nbsp;<span class="company-name-placeholder">ZINTAX FINANCE 咨询有限公司</span>&nbsp;还专业提供全套会计服务、账簿整理核对、税务结算、增值税（GTGT）与进出口（XNK）退税，甚至企业的财务报表审计服务。</p>
<p><span style="color: #ed1c24;"><strong>财务报表服务包内容：</strong></span></p>
<p>– 收集企业的发票、凭证和账簿；</p>
<p>– 收集关于所采用的会计制度、形式及固定资产折旧方法的通知；</p>
<p>– 实地考察，了解企业的运营流程与实际情况；</p>
<p>– 核对会计凭证、账簿，对凭证进行分类 and 整理；</p>
<p>– 剔除、调整和修改不合规的凭证；</p>
<p>– 编制工具、器具、待摊费用、待结转费用的分配表；</p>
<p>– 检查工资费用、医疗保险、社会保险等；</p>
<p>– 计算并编制固定资产折旧表；</p>
<p>– 在专业会计软件上进行会计记账；</p>
<p>– 结转、汇总信息以编制会计账簿、财务报表、经营成果表、财务报表附注；</p>
<p>– 与企业讨论与执行结果相关的内容 and 业务；</p>
<p>– 按照规定打印财务报表 and 会计账簿；</p>
<p>– 在汇总信息以编制财务报表的过程中向企业提供相关咨询。</p>`,
        order: 5
      }
    ];
    await Section.insertMany(sections);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seed();
