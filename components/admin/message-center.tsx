/**
 * Message Center Component
 * Interface for managing visitor messages and inquiries
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/use-content';
import { visitorMessageService } from '@/lib/services/visitor-message-service';
import type { VisitorMessage } from '@/types/content';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Mail, MailOpen, Trash2, Phone, User, MessageSquare, Briefcase, Filter, ShoppingCart, LifeBuoy } from 'lucide-react';

export default function MessageCenter() {
  const [messages, setMessages] = useState<VisitorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'contact' | 'product_inquiry' | 'support' | 'other'>('all');
  const [selectedMessage, setSelectedMessage] = useState<VisitorMessage | null>(null);

  const { getList } = useMessages();

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    setLoading(true);
    let result;
    
    if (filter === 'unread') {
      result = await getList(1, 100, { is_read: false });
    } else if (filter === 'all') {
      result = await getList(1, 100);
    } else {
      result = await getList(1, 100, { message_type: filter });
    }

    if (result.success && result.data) {
      setMessages(result.data.data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await visitorMessageService.markAsRead(id);
      loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此留言吗？')) return;

    try {
      await visitorMessageService.delete(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const getMessageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contact: '联系咨询',
      product_inquiry: '产品咨询',
      support: '技术支持',
      other: '一般咨询',
    };
    return labels[type] || type;
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'product_inquiry':
        return <ShoppingCart className="h-4 w-4" />;
      case 'support':
        return <LifeBuoy className="h-4 w-4" />;
      case 'other':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">留言中心</h1>
          <p className="text-white/60 mt-1">管理访客留言和咨询</p>
        </div>
      </div>
      <div className="flex gap-2">
        {[
          { value: 'all', label: '全部', icon: <Briefcase className="h-4 w-4" /> },
          { value: 'unread', label: '未读', icon: <Mail className="h-4 w-4" /> },
          { value: 'contact', label: '联系咨询', icon: <Phone className="h-4 w-4" /> },
          { value: 'product_inquiry', label: '产品咨询', icon: <ShoppingCart className="h-4 w-4" /> },
          { value: 'support', label: '技术支持', icon: <LifeBuoy className="h-4 w-4" /> },
          { value: 'other', label: '一般咨询', icon: <MessageSquare className="h-4 w-4" /> },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value as any)}
            className={`px-4 py-2 rounded-lg border transition-all text-sm ${
              filter === item.value
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={fadeInUp}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.isRead) {
                    handleMarkAsRead(message.id);
                  }
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-white/10 border-white/20'
                    : message.isRead
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.isRead ? (
                      <MailOpen className="h-4 w-4 text-white/40" />
                    ) : (
                      <Mail className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="font-medium">{message.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    {getMessageTypeIcon(message.messageType)}
                    <span>{getMessageTypeLabel(message.messageType)}</span>
                  </div>
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{message.message}</p>
                <p className="text-xs text-white/40 mt-2">
                  {new Date(message.createdAt).toLocaleString('zh-CN')}
                </p>
              </motion.div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无留言</p>
              </div>
            )}
          </motion.div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-black border border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-white/60" />
                      <h2 className="text-2xl font-bold">{selectedMessage.name}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {selectedMessage.email}
                      </span>
                      {selectedMessage.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedMessage.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg transition-all text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageTypeIcon(selectedMessage.messageType)}
                    <span className="text-sm text-white/60">
                      {getMessageTypeLabel(selectedMessage.messageType)}
                    </span>
                    <span className="text-sm text-white/40">
                      • {new Date(selectedMessage.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/90 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {!selectedMessage.isRead && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-400">
                    此留言已标记为已读
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/40">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>选择一条留言查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
