
import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Modal } from './Modal';
import { DeleteIcon, AddIcon } from './icons';

interface CalendarProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const Calendar: React.FC<CalendarProps> = ({ events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('other');

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${month}-${dayStr}`;
    setSelectedDate(dateStr);
    setIsModalOpen(true);
    // Reset form
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventType('other');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && newEventTitle) {
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: newEventTitle,
        description: newEventDescription,
        date: selectedDate,
        type: newEventType,
      };
      setEvents([...events, newEvent]);
      // Clear inputs but keep modal open to see added event or add more
      setNewEventTitle('');
      setNewEventDescription('');
      setNewEventType('other');
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 bg-gray-50/50"></div>);
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const dateStr = `${currentDate.getFullYear()}-${month}-${dayStr}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

        days.push(
            <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className={`h-24 border border-gray-100 p-2 cursor-pointer hover:bg-brand-light/30 transition-colors relative overflow-hidden group ${isToday ? 'bg-blue-50' : 'bg-white'}`}
            >
                <span className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${isToday ? 'bg-brand-primary text-white' : 'text-gray-700'}`}>
                    {day}
                </span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                    {dayEvents.map(event => (
                         <div key={event.id} className={`text-xs px-1.5 py-0.5 rounded truncate text-white ${getEventTypeColor(event.type)}`}>
                             {event.title}
                         </div>
                    ))}
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-brand-light p-1 rounded-full text-brand-dark">
                        <AddIcon className="w-3 h-3" />
                    </div>
                </div>
            </div>
        );
    }
    return days;
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
      switch(type) {
          case 'exam': return 'bg-red-500';
          case 'holiday': return 'bg-green-500';
          case 'meeting': return 'bg-blue-500';
          default: return 'bg-gray-500';
      }
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    switch(type) {
        case 'exam': return 'Prova/Exame';
        case 'holiday': return 'Feriado/Recesso';
        case 'meeting': return 'Reunião';
        default: return 'Outro';
    }
};

  const selectedDayEvents = events.filter(e => e.date === selectedDate);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-brand-primary">
                Hoje
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-0 mb-2 text-center">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-sm font-medium text-gray-500 uppercase tracking-wider py-2">
                {day}
            </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden flex-1">
        {renderDays()}
      </div>

      {/* Modal for Events */}
      {isModalOpen && selectedDate && (
          <Modal title={`Eventos: ${new Date(selectedDate.split('-').map(Number) as any).toLocaleDateString('pt-BR')}`} onClose={() => setIsModalOpen(false)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Event List */}
                  <div className="border-r border-gray-200 pr-6">
                      <h4 className="font-semibold text-gray-700 mb-4">Eventos do Dia</h4>
                      {selectedDayEvents.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">Nenhum evento agendado.</p>
                      ) : (
                          <ul className="space-y-3">
                              {selectedDayEvents.map(event => (
                                  <li key={event.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 relative group">
                                      <div className="flex items-center justify-between mb-1">
                                          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${getEventTypeColor(event.type)}`}>
                                              {getEventTypeLabel(event.type)}
                                          </span>
                                          <button 
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <DeleteIcon className="w-4 h-4" />
                                          </button>
                                      </div>
                                      <p className="font-medium text-gray-800">{event.title}</p>
                                      {event.description && <p className="text-xs text-gray-500 mt-1">{event.description}</p>}
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>

                  {/* Right: Add Form */}
                  <div>
                      <h4 className="font-semibold text-gray-700 mb-4">Adicionar Novo Evento</h4>
                      <form onSubmit={handleAddEvent} className="space-y-3">
                          <div>
                              <label className="block text-xs font-medium text-gray-700">Título</label>
                              <input 
                                type="text" 
                                required 
                                value={newEventTitle} 
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
                                placeholder="Ex: Reunião de Pais"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-700">Tipo</label>
                              <select 
                                value={newEventType} 
                                onChange={(e) => setNewEventType(e.target.value as any)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
                              >
                                  <option value="other">Outro</option>
                                  <option value="exam">Prova/Exame</option>
                                  <option value="meeting">Reunião</option>
                                  <option value="holiday">Feriado/Recesso</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-700">Descrição (Opcional)</label>
                              <textarea 
                                rows={3} 
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
                              ></textarea>
                          </div>
                          <button type="submit" className="w-full bg-brand-primary text-white py-2 rounded-md hover:bg-brand-secondary transition-colors text-sm font-medium">
                              Adicionar Evento
                          </button>
                      </form>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};
