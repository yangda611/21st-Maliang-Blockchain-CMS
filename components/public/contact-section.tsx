/**
 * Contact Section Component
 * Contact form and company information with multi-language support
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import ContactForm from '@/components/public/contact-form';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  description?: string;
}

interface ContactSectionProps {
  lang: string;
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 多语言内容
  const content = {
    zh: {
      headerTitle: '联系我们',
      headerDescription: '无论您是寻求技术支持、商务合作，还是对我们的区块链CMS解决方案感兴趣，我们都很乐意与您交流。',
      contactTitle: '联系方式',
      companyTitle: '关于Maliang',
      companyDescription: 'Maliang区块链CMS是基于区块链技术构建的现代化内容管理系统，致力于为企业提供安全、高效、可靠的内容创作和管理解决方案。我们相信技术创新能够推动内容生态的可持续发展。',
      sendMessage: '发送消息',
      formTitle: '联系我们',
      formDescription: '请填写以下信息，我们会尽快回复您',
      successTitle: '消息已发送！',
      successMessage: '感谢您的联系，我们会尽快回复您的问题。',
      faqTitle: '常见问题',
      faqItems: [
        {
          question: '你们提供技术支持吗？',
          answer: '是的，我们提供7×24小时技术支持服务，包括在线文档、社区论坛和技术咨询。',
        },
        {
          question: '区块链CMS适合哪些类型的企业？',
          answer: '区块链CMS特别适合对内容安全性有高要求的企业，如媒体、金融、法律等行业的机构。',
        },
        {
          question: '如何开始使用Maliang CMS？',
          answer: '您可以联系我们的销售团队获取演示账号，或直接购买我们的产品开始使用。',
        },
        {
          question: '支持多少种语言？',
          answer: '目前支持6种主流语言：中文、英文、日语、韩语、阿拉伯语和西班牙语。',
        },
      ],
      contactInfo: [
        {
          title: '邮箱',
          content: 'contact@maliang.com',
          description: '我们会在24小时内回复您的邮件',
        },
        {
          title: '电话',
          content: '+86 400-888-8888',
          description: '工作日 9:00-18:00',
        },
        {
          title: '地址',
          content: '北京市朝阳区科技园区',
          description: '创新大厦 15层 1501室',
        },
        {
          title: '工作时间',
          content: '周一至周五 9:00-18:00',
          description: '周末及节假日请发送邮件',
        },
      ],
    },
    en: {
      headerTitle: 'Contact Us',
      headerDescription: 'Whether you are seeking technical support, business cooperation, or are interested in our blockchain CMS solutions, we are delighted to communicate with you.',
      contactTitle: 'Contact Information',
      companyTitle: 'About Maliang',
      companyDescription: 'Maliang Blockchain CMS is a modern content management system built on blockchain technology, dedicated to providing enterprises with secure, efficient, and reliable content creation and management solutions. We believe that technological innovation can promote the sustainable development of the content ecosystem.',
      sendMessage: 'Send Message',
      formTitle: 'Contact Us',
      formDescription: 'Please fill out the following information and we will reply to you as soon as possible',
      successTitle: 'Message Sent!',
      successMessage: 'Thank you for contacting us. We will reply to your questions as soon as possible.',
      faqTitle: 'Frequently Asked Questions',
      faqItems: [
        {
          question: 'Do you provide technical support?',
          answer: 'Yes, we provide 7×24 hour technical support services, including online documentation, community forums, and technical consultation.',
        },
        {
          question: 'Which types of enterprises is blockchain CMS suitable for?',
          answer: 'Blockchain CMS is particularly suitable for enterprises with high requirements for content security, such as institutions in media, finance, legal and other industries.',
        },
        {
          question: 'How to start using Maliang CMS?',
          answer: 'You can contact our sales team to get a demo account, or directly purchase our product to start using it.',
        },
        {
          question: 'How many languages are supported?',
          answer: 'Currently supports 6 mainstream languages: Chinese, English, Japanese, Korean, Arabic, and Spanish.',
        },
      ],
      contactInfo: [
        {
          title: 'Email',
          content: 'contact@maliang.com',
          description: 'We will reply to your email within 24 hours',
        },
        {
          title: 'Phone',
          content: '+86 400-888-8888',
          description: 'Business hours 9:00-18:00',
        },
        {
          title: 'Address',
          content: '15th Floor, Innovation Building, Technology Park, Chaoyang District, Beijing',
          description: '15th Floor, Innovation Building, Room 1501',
        },
        {
          title: 'Business Hours',
          content: 'Monday to Friday 9:00-18:00',
          description: 'Please send email on weekends and holidays',
        },
      ],
    },
    ja: {
      headerTitle: 'お問い合わせ',
      headerDescription: '技術サポート、ビジネス協力、または当社のブロックチェーンCMSソリューションにご興味をお持ちでしたら、喜んでお手伝いいたします。',
      contactTitle: '連絡先情報',
      companyTitle: 'Maliangについて',
      companyDescription: 'MaliangブロックチェーンCMSはブロックチェーン技術に基づいて構築された現代的なコンテンツ管理システムで、企業に安全で効率的、信頼性の高いコンテンツ作成と管理ソリューションを提供することに専念しています。技術革新がコンテンツエコシステムの持続可能な発展を推進できると信じています。',
      sendMessage: 'メッセージを送る',
      formTitle: 'お問い合わせ',
      formDescription: '以下の情報を入力してください。できるだけ早く返信いたします',
      successTitle: 'メッセージが送信されました！',
      successMessage: 'お問い合わせありがとうございます。ご質問にできるだけ早くお答えします。',
      faqTitle: 'よくある質問',
      faqItems: [
        {
          question: '技術サポートを提供していますか？',
          answer: 'はい、7×24時間の技術サポートサービスを提供しており、オンラインドキュメント、コミュニティフォーラム、技術相談を含みます。',
        },
        {
          question: 'ブロックチェーンCMSはどのタイプの企業に適していますか？',
          answer: 'ブロックチェーンCMSは、メディア、金融、法律などの業界の機関など、コンテンツセキュリティに高い要件を持つ企業に特に適しています。',
        },
        {
          question: 'Maliang CMSの使用を開始するにはどうすればよいですか？',
          answer: '販売チームに連絡してデモアカウントを取得するか、製品を直接購入して使用を開始できます。',
        },
        {
          question: '何言語をサポートしていますか？',
          answer: '現在、中国語、英語、日本語、韓国語、アラビア語、スペイン語の6つの主流言語をサポートしています。',
        },
      ],
      contactInfo: [
        {
          title: 'メール',
          content: 'contact@maliang.com',
          description: '24時間以内にメールに返信いたします',
        },
        {
          title: '電話',
          content: '+86 400-888-8888',
          description: '営業時間 9:00-18:00',
        },
        {
          title: '住所',
          content: '北京市朝陽区科技园区イノベーションビル15階',
          description: 'イノベーションビル15階1501室',
        },
        {
          title: '営業時間',
          content: '月曜日から金曜日 9:00-18:00',
          description: '週末と祝日はメールでお問い合わせください',
        },
      ],
    },
    ko: {
      headerTitle: '문의하기',
      headerDescription: '기술 지원, 비즈니스 협력 또는 당사의 블록체인 CMS 솔루션에 관심이 있으시면 기꺼이 소통하겠습니다.',
      contactTitle: '연락처 정보',
      companyTitle: 'Maliang 소개',
      companyDescription: 'Maliang 블록체인 CMS는 블록체인 기술을 기반으로 구축된 현대적인 콘텐츠 관리 시스템으로, 기업에 안전하고 효율적이며 신뢰할 수 있는 콘텐츠 생성 및 관리 솔루션을 제공하는 데 전념하고 있습니다. 기술 혁신이 콘텐츠 생태계의 지속 가능한 발전을 촉진할 수 있다고 믿습니다.',
      sendMessage: '메시지 보내기',
      formTitle: '문의하기',
      formDescription: '아래 정보를 입력해 주세요. 가능한 한 빨리 답변드리겠습니다',
      successTitle: '메시지가 전송되었습니다!',
      successMessage: '문의해 주셔서 감사합니다. 귀하의 질문에 가능한 한 빨리 답변드리겠습니다.',
      faqTitle: '자주 묻는 질문',
      faqItems: [
        {
          question: '기술 지원을 제공하나요?',
          answer: '네, 온라인 문서, 커뮤니티 포럼 및 기술 상담을 포함한 7×24시간 기술 지원 서비스를 제공합니다.',
        },
        {
          question: '블록체인 CMS는 어떤 유형의 기업에 적합한가요?',
          answer: '블록체인 CMS는 미디어, 금융, 법률 등 산업의 기관과 같이 콘텐츠 보안에 대한 요구사항이 높은 기업에 특히 적합합니다.',
        },
        {
          question: 'Maliang CMS 사용을 시작하려면 어떻게 해야 하나요?',
          answer: '영업팀에 연락하여 데모 계정을 받거나 제품을 직접 구매하여 사용을 시작할 수 있습니다.',
        },
        {
          question: '몇 개 언어를 지원하나요?',
          answer: '현재 중국어, 영어, 일본어, 한국어, 아랍어, 스페인어 등 6개의 주요 언어를 지원합니다.',
        },
      ],
      contactInfo: [
        {
          title: '이메일',
          content: 'contact@maliang.com',
          description: '24시간 이내에 이메일에 답장드리겠습니다',
        },
        {
          title: '전화',
          content: '+86 400-888-8888',
          description: '업무 시간 9:00-18:00',
        },
        {
          title: '주소',
          content: '베이징시 차오양구 기술단지 혁신빌딩 15층',
          description: '혁신빌딩 15층 1501호',
        },
        {
          title: '업무 시간',
          content: '월요일부터 금요일 9:00-18:00',
          description: '주말과 휴일에는 이메일로 문의해 주세요',
        },
      ],
    },
    ar: {
      headerTitle: 'اتصل بنا',
      headerDescription: 'سواء كنت تبحث عن الدعم الفني أو التعاون التجاري أو مهتماً بحلول CMS البلوكشين الخاصة بنا، فإننا مسرورون للتواصل معك.',
      contactTitle: 'معلومات الاتصال',
      companyTitle: 'حول Maliang',
      companyDescription: 'Maliang Blockchain CMS هو نظام إدارة محتوى حديث مبني على تقنية البلوكشين، مكرس لتزويد المؤسسات بحلول إنشاء وإدارة المحتوى الآمنة والفعالة والموثوقة. نحن نؤمن بأن الابتكار التكنولوجي يمكن أن يدفع التنمية المستدامة لنظام المحتوى البيئي.',
      sendMessage: 'إرسال رسالة',
      formTitle: 'اتصل بنا',
      formDescription: 'يرجى ملء المعلومات التالية وسنرد عليك في أقرب وقت ممكن',
      successTitle: 'تم إرسال الرسالة!',
      successMessage: 'شكراً لك على الاتصال بنا. سنرد على أسئلتك في أقرب وقت ممكن.',
      faqTitle: 'الأسئلة الشائعة',
      faqItems: [
        {
          question: 'هل تقدمون دعماً فنياً؟',
          answer: 'نعم، نقدم خدمات دعم فني 7×24 ساعة، بما في ذلك الوثائق عبر الإنترنت ومنتديات المجتمع والاستشارات الفنية.',
        },
        {
          question: 'أي أنواع المؤسسات مناسبة لـ CMS البلوكشين؟',
          answer: 'CMS البلوكشين مناسب بشكل خاص للمؤسسات ذات المتطلبات العالية لأمان المحتوى، مثل مؤسسات الإعلام والمالية والقانونية.',
        },
        {
          question: 'كيف تبدأ في استخدام Maliang CMS؟',
          answer: 'يمكنك الاتصال بفريق المبيعات للحصول على حساب تجريبي، أو شراء المنتج مباشرة لبدء الاستخدام.',
        },
        {
          question: 'كم لغة مدعومة؟',
          answer: 'يدعم حالياً 6 لغات رئيسية: الصينية والإنجليزية واليابانية والكورية والعربية والإسبانية.',
        },
      ],
      contactInfo: [
        {
          title: 'البريد الإلكتروني',
          content: 'contact@maliang.com',
          description: 'سنرد على بريدك الإلكتروني خلال 24 ساعة',
        },
        {
          title: 'الهاتف',
          content: '+86 400-888-8888',
          description: 'ساعات العمل 9:00-18:00',
        },
        {
          title: 'العنوان',
          content: 'الطابق 15، مبنى الابتكار، حديقة التكنولوجيا، منطقة تشاويانغ، بكين',
          description: 'الطابق 15، مبنى الابتكار، غرفة 1501',
        },
        {
          title: 'ساعات العمل',
          content: 'الاثنين إلى الجمعة 9:00-18:00',
          description: 'يرجى إرسال بريد إلكتروني في عطلات نهاية الأسبوع والعطلات',
        },
      ],
    },
    es: {
      headerTitle: 'Contáctanos',
      headerDescription: 'Ya sea que busques soporte técnico, cooperación comercial o estés interesado en nuestras soluciones CMS blockchain, estamos encantados de comunicarnos contigo.',
      contactTitle: 'Información de Contacto',
      companyTitle: 'Acerca de Maliang',
      companyDescription: 'Maliang Blockchain CMS es un sistema moderno de gestión de contenido construido sobre tecnología blockchain, dedicado a proporcionar a las empresas soluciones seguras, eficientes y confiables de creación y gestión de contenido. Creemos que la innovación tecnológica puede promover el desarrollo sostenible del ecosistema de contenido.',
      sendMessage: 'Enviar Mensaje',
      formTitle: 'Contáctanos',
      formDescription: 'Por favor completa la siguiente información y te responderemos lo antes posible',
      successTitle: '¡Mensaje Enviado!',
      successMessage: 'Gracias por contactarnos. Responderemos a tus preguntas lo antes posible.',
      faqTitle: 'Preguntas Frecuentes',
      faqItems: [
        {
          question: '¿Proporcionan soporte técnico?',
          answer: 'Sí, proporcionamos servicios de soporte técnico 7×24 horas, incluyendo documentación en línea, foros comunitarios y consultas técnicas.',
        },
        {
          question: '¿Para qué tipos de empresas es adecuado el CMS blockchain?',
          answer: 'CMS blockchain es particularmente adecuado para empresas con altos requisitos de seguridad de contenido, como instituciones en industrias de medios, finanzas, legales, etc.',
        },
        {
          question: '¿Cómo empezar a usar Maliang CMS?',
          answer: 'Puedes contactar a nuestro equipo de ventas para obtener una cuenta demo, o comprar directamente nuestro producto para comenzar a usarlo.',
        },
        {
          question: '¿Cuántos idiomas están soportados?',
          answer: 'Actualmente soporta 6 idiomas principales: chino, inglés, japonés, coreano, árabe y español.',
        },
      ],
      contactInfo: [
        {
          title: 'Correo Electrónico',
          content: 'contact@maliang.com',
          description: 'Responderemos a tu correo electrónico dentro de 24 horas',
        },
        {
          title: 'Teléfono',
          content: '+86 400-888-8888',
          description: 'Horario de oficina 9:00-18:00',
        },
        {
          title: 'Dirección',
          content: 'Piso 15, Edificio de Innovación, Parque Tecnológico, Distrito Chaoyang, Beijing',
          description: 'Piso 15, Edificio de Innovación, Sala 1501',
        },
        {
          title: 'Horario de Oficina',
          content: 'Lunes a Viernes 9:00-18:00',
          description: 'Por favor envía correo electrónico los fines de semana y feriados',
        },
      ],
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.en;

  const contactInfoWithIcons = currentContent.contactInfo.map((info, index) => ({
    ...info,
    icon: [Mail, Phone, MapPin, Clock][index],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {currentContent.headerTitle}
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          {currentContent.headerDescription}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-6">{currentContent.contactTitle}</h2>
            <div className="space-y-6">
              {contactInfoWithIcons.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="p-3 bg-white/10 rounded-lg">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                    <p className="text-white/80 mb-1">{info.content}</p>
                    {info.description && (
                      <p className="text-sm text-white/60">{info.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-4">{currentContent.companyTitle}</h3>
            <p className="text-white/80 leading-relaxed">
              {currentContent.companyDescription}
            </p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {!isSubmitted ? (
            <div className="p-8 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-6">{currentContent.sendMessage}</h2>
              <ContactForm
                title={currentContent.formTitle}
                description={currentContent.formDescription}
                lang={lang}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-green-500/10 rounded-xl border border-green-500/20 text-center"
            >
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-400 mb-2">{currentContent.successTitle}</h3>
              <p className="text-white/80">
                {currentContent.successMessage}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-semibold mb-8 text-center">{currentContent.faqTitle}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {currentContent.faqItems.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
              <p className="text-white/70 text-sm">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
