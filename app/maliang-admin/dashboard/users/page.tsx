'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { TopNavigation } from '@/components/ui/top-navigation';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Edit, UserCheck, UserX, Search, X } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
    is_active: true
  });
  
  const [editUser, setEditUser] = useState({
    email: '',
    role: 'admin' as 'admin' | 'super_admin',
    is_active: true
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          router.push('/maliang-admin');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/maliang-admin');
          return;
        }

        // 获取用户信息
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userError) {
          console.error('获取用户信息失败:', userError);
          router.push('/maliang-admin');
          return;
        }

        setCurrentUser(userData);
      } catch (error) {
        console.error('鉴权检查失败:', error);
        router.push('/maliang-admin');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, currentPage, itemsPerPage, searchTerm]);

  // 搜索处理函数 - 改为回车键触发
  const handleSearch = useCallback((term: string) => {
    // 不再实时搜索，只更新输入框的值
    setSearchTerm(term);
  }, []);

  // 回车键搜索处理
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 如果输入为空或长度大于等于2个字符才触发搜索
      if (searchTerm === '' || searchTerm.length >= 2) {
        setCurrentPage(1); // 重置到第一页
        // 主动触发搜索
        if (searchTerm && searchTerm.length >= 2) {
          fetchUsersWithSearch();
        } else if (!searchTerm) {
          fetchUsers();
        }
      }
    }
  }, [searchTerm]);

  // 清空搜索
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  }, [searchTimeout]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        throw new Error('Supabase 客户端未初始化');
      }
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // 添加动画延迟，让数据更新更平滑
      setTimeout(() => {
        setUsers(data || []);
        setTotalItems(data.length);
        setTotalPages(1); // 无分页时只有1页
      }, 150);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      setError(error instanceof Error ? error.message : '获取用户列表失败');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  const fetchUsersWithSearch = async () => {
    try {
      setIsSearching(true);
      setLoading(true);
      
      const response = await fetch(`/api/users?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取用户列表失败');
      }

      // 添加动画延迟，让数据更新更平滑
      setTimeout(() => {
        setUsers(data.data || []);
        setTotalItems(data.pagination.totalItems);
        setTotalPages(data.pagination.totalPages);
      }, 150);
    } catch (error: any) {
      console.error('获取用户列表失败:', error);
      setError(error.message || '获取用户列表失败');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsSearching(false);
      }, 200);
    }
  };

  // 当页码或每页条数变化时，重新获取数据
  useEffect(() => {
    if (currentUser) {
      if (searchTerm && searchTerm.length >= 2) {
        fetchUsersWithSearch();
      } else if (!searchTerm) {
        fetchUsers();
      }
    }
  }, [currentPage, itemsPerPage, currentUser]); // 移除 searchTerm 依赖，避免自动触发

  const handleAddUser = async () => {
    try {
      setError(null);

      // 验证输入
      if (!newUser.email || !newUser.password) {
        setError('请填写邮箱和密码');
        return;
      }

      // 使用API端点创建用户
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          is_active: newUser.is_active
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建用户失败');
      }

      setSuccess('用户创建成功');
      setNewUser({ email: '', password: '', role: 'admin', is_active: true });
      setShowAddDialog(false);
      setSearchTerm(''); // 清空搜索
      fetchUsers();
    } catch (error: any) {
      console.error('创建用户失败:', error);
      setError(error.message || '创建用户失败');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      setError(null);

      if (!supabase) {
        throw new Error('Supabase 客户端未初始化');
      }

      // 更新admin_users表
      const { error } = await supabase
        .from('admin_users')
        .update({
          email: editUser.email,
          role: editUser.role,
          is_active: editUser.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) {
        throw error;
      }

      setSuccess('用户更新成功');
      setShowEditDialog(false);
      setSelectedUser(null);
      setSearchTerm(''); // 清空搜索
      fetchUsers();
    } catch (error: any) {
      console.error('更新用户失败:', error);
      setError(error.message || '更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!currentUser || userId === currentUser.id) {
      setError('不能删除自己的账号');
      return;
    }

    if (!confirm(`确定要删除用户 ${userEmail} 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      setError(null);

      if (!supabase) {
        throw new Error('Supabase 客户端未初始化');
      }

      // 删除admin_users表记录
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setSuccess('用户删除成功');
      setSearchTerm(''); // 清空搜索
      fetchUsers();
    } catch (error: any) {
      console.error('删除用户失败:', error);
      setError(error.message || '删除用户失败');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      setError(null);

      if (!supabase) {
        throw new Error('Supabase 客户端未初始化');
      }

      const { error } = await supabase
        .from('admin_users')
        .update({
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setSuccess(`用户状态已${!isActive ? '启用' : '禁用'}`);
      setSearchTerm(''); // 清空搜索
      fetchUsers();
    } catch (error: any) {
      console.error('更新用户状态失败:', error);
      setError(error.message || '更新用户状态失败');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* 侧边栏 */}
      <div className="animate-slide-in-left">
        <Sidebar activeItem="users" />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <div className="animate-fade-in-up animate-delay-100">
          <TopNavigation user={currentUser} />
        </div>

        {/* 主内容 */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in-up animate-delay-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">员工管理</h1>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    添加员工
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>添加新员工</DialogTitle>
                    <DialogDescription>
                      创建一个新的管理员账户。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        邮箱
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        密码
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        角色
                      </Label>
                      <Select value={newUser.role} onValueChange={(value: 'admin' | 'super_admin') => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择角色" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">管理员</SelectItem>
                          <SelectItem value="super_admin">超级管理员</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {error && (
                    <Alert className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <DialogFooter>
                    <Button onClick={handleAddUser}>创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4">
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>员工列表</CardTitle>
                <CardDescription>管理系统中的所有管理员账户{searchTerm && ` - 搜索: "${searchTerm}"`}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 搜索栏 - 优化视觉设计 */}
                <div className="mb-6">
                  <div className="flex gap-3 items-center">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className={`h-5 w-5 transition-colors ${searchTerm ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                      <Input
                        type="text"
                        placeholder="输入邮箱地址搜索员工（至少2个字符）- 按回车键搜索"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
                          searchTerm ? 'border-primary/50 bg-primary/5' : 'border-gray-200'
                        }`}
                      />
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                          aria-label="清空搜索"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                      {isSearching && (
                        <div className="absolute inset-y-0 right-10 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      )}
                    </div>
                    {searchTerm && (
                      <Button
                        onClick={clearSearch}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-colors"
                      >
                        <X className="h-4 w-4 mr-1" />
                        重置
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    💡 提示：输入至少2个字符，按回车键开始搜索
                  </p>
                </div>
                {/* 搜索结果提示 */}
                {isSearching && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in-up">
                    <p className="text-sm text-blue-700">
                      <Search className="w-4 h-4 inline mr-2" />
                      正在搜索: "{searchTerm}"
                    </p>
                  </div>
                )}
                
                {/* 搜索结果统计 */}
                {searchTerm && !isSearching && !loading && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up">
                    <p className="text-sm text-green-700">
                      <Search className="w-4 h-4 inline mr-2" />
                      找到 {totalItems} 个匹配的用户
                      {searchTerm && (
                        <span className="ml-2 text-green-600">
                          搜索词: "{searchTerm}"
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>邮箱</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>最后登录</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            {searchTerm ? '没有找到匹配的用户' : '暂无数据'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u, index) => (
                          <TableRow 
                            key={u.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <TableCell className="font-medium">{u.email}</TableCell>
                            <TableCell>
                              <Badge variant={u.role === 'super_admin' ? 'default' : 'secondary'}>
                                {u.role === 'super_admin' ? '超级管理员' : '管理员'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.is_active ? 'default' : 'destructive'}>
                                {u.is_active ? '启用' : '禁用'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(u.created_at)}</TableCell>
                            <TableCell>{u.last_login ? formatDate(u.last_login) : '从未登录'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setEditUser({
                                      email: u.email,
                                      role: u.role,
                                      is_active: u.is_active
                                    });
                                    setShowEditDialog(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(u.id, u.is_active)}
                                >
                                  {u.is_active ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
                
                {/* 分页控件 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">每页显示</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(parseInt(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-600">条记录</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        上一页
                      </Button>
                      <span className="text-sm text-gray-600">
                        第 {currentPage} 页，共 {totalPages} 页
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* 编辑用户对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑员工</DialogTitle>
            <DialogDescription>
              修改员工信息。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                邮箱
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                角色
              </Label>
              <Select value={editUser.role} onValueChange={(value: 'admin' | 'super_admin') => setEditUser({ ...editUser, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="super_admin">超级管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                状态
              </Label>
              <Select value={editUser.is_active ? 'active' : 'inactive'} onValueChange={(value) => setEditUser({ ...editUser, is_active: value === 'active' })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateUser}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}