import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit3, Check, X } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/todos`, newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
    setLoading(false);
  };

  const updateTodo = async (todoId, updates) => {
    try {
      const response = await axios.put(`${API}/todos/${todoId}`, updates);
      setTodos(todos.map(todo => todo.id === todoId ? response.data : todo));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API}/todos/${todoId}`);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = async (todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
  };

  const startEditing = (todo) => {
    setEditingTodo({
      ...todo,
      editTitle: todo.title,
      editDescription: todo.description || ''
    });
  };

  const saveEdit = async () => {
    if (!editingTodo.editTitle.trim()) return;
    
    await updateTodo(editingTodo.id, {
      title: editingTodo.editTitle,
      description: editingTodo.editDescription
    });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/fenado-ai-farm-public/generated/7df9f4e6-db2e-40be-994c-fbeea6ae11dc.webp')`
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">My Todo List</h1>
              <div className="flex justify-center gap-4">
                <Badge variant="outline" className="bg-white bg-opacity-20 text-white border-white">
                  {todos.length} Total
                </Badge>
                <Badge variant="outline" className="bg-green-500 bg-opacity-20 text-white border-green-300">
                  {completedCount} Completed
                </Badge>
                <Badge variant="outline" className="bg-orange-500 bg-opacity-20 text-white border-orange-300">
                  {todos.length - completedCount} Pending
                </Badge>
              </div>
            </div>

            {/* Add New Todo */}
            <Card className="mb-8 bg-white bg-opacity-90 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Todo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="What needs to be done?"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && createTodo()}
                  className="text-lg"
                />
                <Textarea
                  placeholder="Add a description (optional)"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="resize-none"
                  rows={2}
                />
                <Button 
                  onClick={createTodo} 
                  disabled={loading || !newTodo.title.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {loading ? 'Adding...' : 'Add Todo'}
                </Button>
              </CardContent>
            </Card>

            {/* Todo List */}
            <div className="space-y-4">
              {todos.length === 0 ? (
                <Card className="bg-white bg-opacity-90 backdrop-blur-md border-0 shadow-xl">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 text-lg">No todos yet. Add one above to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                todos.map((todo) => (
                  <Card 
                    key={todo.id} 
                    className={`bg-white bg-opacity-90 backdrop-blur-md border-0 shadow-xl transition-all duration-200 hover:shadow-2xl ${
                      todo.completed ? 'opacity-75' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      {editingTodo && editingTodo.id === todo.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingTodo.editTitle}
                            onChange={(e) => setEditingTodo({ ...editingTodo, editTitle: e.target.value })}
                            className="text-lg font-medium"
                          />
                          <Textarea
                            value={editingTodo.editDescription}
                            onChange={(e) => setEditingTodo({ ...editingTodo, editDescription: e.target.value })}
                            className="resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm" className="bg-green-500 hover:bg-green-600">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button onClick={cancelEdit} size="sm" variant="outline">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleComplete(todo)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-medium mb-1 ${
                              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-sm mb-3 ${
                                todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                              }`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Created: {new Date(todo.created_at).toLocaleDateString()}</span>
                              {todo.updated_at !== todo.created_at && (
                                <span>Updated: {new Date(todo.updated_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditing(todo)}
                              size="sm"
                              variant="outline"
                              className="p-2"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteTodo(todo.id)}
                              size="sm"
                              variant="outline"
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;