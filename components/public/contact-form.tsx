/**
 * Contact Form Component
 * Public form for visitor inquiries and messages
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { visitorMessageService } from '@/lib/services/visitor-message-service';
import { fadeInUp } from '@/utils/animations';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail, validatePhone } from '@/utils/validation';
import type { MessageType } from '@/types/content';

interface ContactFormProps {
  messageType?: MessageType;
  relatedId?: string;
  title?: string;
  description?: string;
  lang?: string;
}

export default function ContactForm({
  messageType = 'contact',
  relatedId,
  title = '联系我们',
  description = '请填写以下信息，我们会尽快回复您',
  lang = 'zh',
}: ContactFormProps) {
  // 多语言表单标签
  const formLabels = {
    zh: {
      nameLabel: '姓名',
      namePlaceholder: '请输入您的姓名',
      emailLabel: '邮箱',
      emailPlaceholder: 'your@email.com',
      phoneLabel: '电话 (可选)',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: '留言内容',
      messagePlaceholder: '请输入您的留言...',
      submitButton: '提交留言',
      submittingText: '提交中...',
      nameRequired: '请输入姓名',
      emailRequired: '请输入有效的邮箱地址',
      phoneRequired: '请输入有效的电话号码',
      messageRequired: '请输入留言内容',
      submitError: '提交失败，请稍后重试',
      successTitle: '提交成功！',
      successMessage: '感谢您的留言，我们会尽快回复您。',
    },
    en: {
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone (Optional)',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: 'Message',
      messagePlaceholder: 'Enter your message...',
      submitButton: 'Submit Message',
      submittingText: 'Submitting...',
      nameRequired: 'Please enter your name',
      emailRequired: 'Please enter a valid email address',
      phoneRequired: 'Please enter a valid phone number',
      messageRequired: 'Please enter your message',
      submitError: 'Submission failed, please try again later',
      successTitle: 'Submission Successful!',
      successMessage: 'Thank you for your message. We will reply to you as soon as possible.',
    },
    ja: {
      nameLabel: 'お名前',
      namePlaceholder: 'お名前を入力してください',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'your@email.com',
      phoneLabel: '電話番号（オプション）',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: 'メッセージ',
      messagePlaceholder: 'メッセージを入力してください...',
      submitButton: 'メッセージを送信',
      submittingText: '送信中...',
      nameRequired: 'お名前を入力してください',
      emailRequired: '有効なメールアドレスを入力してください',
      phoneRequired: '有効な電話番号を入力してください',
      messageRequired: 'メッセージを入力してください',
      submitError: '送信に失敗しました。後ほど再試行してください',
      successTitle: '送信成功！',
      successMessage: 'メッセージありがとうございます。できるだけ早くお返事いたします。',
    },
    ko: {
      nameLabel: '이름',
      namePlaceholder: '이름을 입력하세요',
      emailLabel: '이메일',
      emailPlaceholder: 'your@email.com',
      phoneLabel: '전화번호 (선택사항)',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: '메시지',
      messagePlaceholder: '메시지를 입력하세요...',
      submitButton: '메시지 제출',
      submittingText: '제출 중...',
      nameRequired: '이름을 입력하세요',
      emailRequired: '유효한 이메일 주소를 입력하세요',
      phoneRequired: '유효한 전화번호를 입력하세요',
      messageRequired: '메시지를 입력하세요',
      submitError: '제출에 실패했습니다. 나중에 다시 시도하세요',
      successTitle: '제출 성공!',
      successMessage: '메시지 감사합니다. 가능한 한 빨리 답변드리겠습니다.',
    },
    ar: {
      nameLabel: 'الاسم',
      namePlaceholder: 'أدخل اسمك',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'الهاتف (اختياري)',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: 'الرسالة',
      messagePlaceholder: 'أدخل رسالتك...',
      submitButton: 'إرسال الرسالة',
      submittingText: 'جارٍ الإرسال...',
      nameRequired: 'يرجى إدخال اسمك',
      emailRequired: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      phoneRequired: 'يرجى إدخال رقم هاتف صالح',
      messageRequired: 'يرجى إدخال رسالتك',
      submitError: 'فشل في الإرسال، يرجى المحاولة مرة أخرى لاحقاً',
      successTitle: 'تم الإرسال بنجاح!',
      successMessage: 'شكراً لرسالتك. سنرد عليك في أقرب وقت ممكن.',
    },
    es: {
      nameLabel: 'Nombre',
      namePlaceholder: 'Ingrese su nombre',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Teléfono (Opcional)',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Ingrese su mensaje...',
      submitButton: 'Enviar Mensaje',
      submittingText: 'Enviando...',
      nameRequired: 'Por favor ingrese su nombre',
      emailRequired: 'Por favor ingrese una dirección de correo electrónico válida',
      phoneRequired: 'Por favor ingrese un número de teléfono válido',
      messageRequired: 'Por favor ingrese su mensaje',
      submitError: 'Error en el envío, por favor inténtelo más tarde',
      successTitle: '¡Envío Exitoso!',
      successMessage: 'Gracias por su mensaje. Le responderemos lo antes posible.',
    },
  };

  const labels = formLabels[lang as keyof typeof formLabels] || formLabels.zh;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = labels.nameRequired;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = labels.emailRequired;
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.valid) {
        newErrors.phone = labels.phoneRequired;
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = labels.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const result = await visitorMessageService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        messageType,
        relatedId,
        isRead: false,
      });

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrors({ submit: labels.submitError });
      }
    } catch (error) {
      setErrors({ submit: '提交失败，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="p-8 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
      >
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-green-400 mb-2">{labels.successTitle}</h3>
        <p className="text-white/60">{labels.successMessage}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="p-8 bg-black border border-white/10 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-white/60 mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            {labels.nameLabel} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-white/30 transition-all ${
              errors.name ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder={labels.namePlaceholder}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            {labels.emailLabel} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-white/30 transition-all ${
              errors.email ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder={labels.emailPlaceholder}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            {labels.phoneLabel}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-white/30 transition-all ${
              errors.phone ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder={labels.phonePlaceholder}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            {labels.messageLabel} <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-white/30 transition-all resize-none ${
              errors.message ? 'border-red-500' : 'border-white/10'
            }`}
            placeholder={labels.messagePlaceholder}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.message}
            </p>
          )}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
              <span>{labels.submittingText}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{labels.submitButton}</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
