import React, { useState } from 'react';
import { Clock, Copy, Check, Calendar } from 'lucide-react';
import './OperationalInformation.scss'

interface DayHours {
    open: string;
    close: string;
    closed: boolean;
}

interface Hours {
    [key: string]: DayHours;
}

const OperationalInformation: React.FC = () => {
    const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const [hours, setHours] = useState<Hours>({
        Monday: { open: '09:00', close: '17:00', closed: false },
        Tuesday: { open: '09:00', close: '17:00', closed: false },
        Wednesday: { open: '09:00', close: '17:00', closed: false },
        Thursday: { open: '09:00', close: '17:00', closed: false },
        Friday: { open: '09:00', close: '17:00', closed: false },
        Saturday: { open: '10:00', close: '16:00', closed: false },
        Sunday: { open: '12:00', close: '16:00', closed: true }
    });

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [copiedFrom, setCopiedFrom] = useState<string | null>(null);

    const updateHours = (day: string, field: keyof DayHours, value: string | boolean): void => {
        setHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const copyHoursToDay = (fromDay: string, toDay: string): void => {
        setHours(prev => ({
            ...prev,
            [toDay]: { ...prev[fromDay] }
        }));
        setCopiedFrom(fromDay);
        setTimeout(() => setCopiedFrom(null), 1000);
    };

    const copyHoursToMultiple = (fromDay: string, toDays: string[]): void => {
        const newHours = { ...hours };
        toDays.forEach(day => {
            newHours[day] = { ...hours[fromDay] };
        });
        setHours(newHours);
        setCopiedFrom(fromDay);
        setTimeout(() => setCopiedFrom(null), 1500);
    };

    interface QuickCopyButtonsProps {
        day: string;
    }

    const QuickCopyButtons: React.FC<QuickCopyButtonsProps> = ({ day }) => (
        <div className="operating-hours__quick-copy">
            <button
                onClick={() => copyHoursToMultiple(day, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}
                className="operating-hours__quick-copy-button operating-hours__quick-copy-button--weekdays"
            >
                Copy to Weekdays
            </button>
            <button
                onClick={() => copyHoursToMultiple(day, ['Saturday', 'Sunday'])}
                className="operating-hours__quick-copy-button operating-hours__quick-copy-button--weekend"
            >
                Copy to Weekend
            </button>
            <button
                onClick={() => copyHoursToMultiple(day, days.filter(d => d !== day))}
                className="operating-hours__quick-copy-button operating-hours__quick-copy-button--all"
            >
                Copy to All
            </button>
        </div>
    );

    return (
        <div className="operational-info">

            <div className="operational-info__header">
                <Clock size={24} />
                <h3 className="operational-info__title">
                    Operational Information
                </h3>
            </div>

            <div className="operating-hours__days-grid">
                {days.map((day: string, index: number) => (
                    <div
                        key={day}
                        className={`operating-hours__day-card ${hours[day].closed
                            ? 'operating-hours__day-card--closed'
                            : 'operating-hours__day-card--open'
                            } ${copiedFrom === day ? 'operating-hours__day-card--copied' : ''
                            }`}
                    >

                        <div className="operating-hours__day-header">
                            <div className="operating-hours__day-header-info">
                                <div className={`operating-hours__day-badge ${hours[day].closed
                                    ? 'operating-hours__day-badge--closed'
                                    : 'operating-hours__day-badge--open'
                                    }`}>
                                    {shortDays[index]}
                                </div>
                                <div className="operating-hours__day-title">
                                    <h3>{day}</h3>
                                    <p>
                                        {hours[day].closed
                                            ? 'Closed'
                                            : `${hours[day].open} - ${hours[day].close}`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="operating-hours__day-header-controls">
                                <label className="operating-hours__closed-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={hours[day].closed}
                                        onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                                    />
                                    <span>Closed</span>
                                </label>

                                <button
                                    onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                                    className="operating-hours__copy-button"
                                    title="Copy these hours"
                                >
                                    <Copy />
                                </button>
                            </div>
                        </div>

                        {!hours[day].closed && (
                            <div className="operating-hours__time-inputs">
                                <div className="operating-hours__time-inputs-group">
                                    <label>
                                        Opening Time
                                    </label>
                                    <input
                                        type="time"
                                        value={hours[day].open}
                                        onChange={(e) => updateHours(day, 'open', e.target.value)}
                                    />
                                </div>
                                <div className="operating-hours__time-inputs-group">
                                    <label>
                                        Closing Time
                                    </label>
                                    <input
                                        type="time"
                                        value={hours[day].close}
                                        onChange={(e) => updateHours(day, 'close', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedDay === day && !hours[day].closed && (
                            <div className="operating-hours__copy-section">
                                <p className="operating-hours__copy-section-title">
                                    Copy "{day}" hours to:
                                </p>

                                <div className="operating-hours__copy-targets">
                                    {days.filter((d: string) => d !== day).map((targetDay: string) => (
                                        <button
                                            key={targetDay}
                                            onClick={() => copyHoursToDay(day, targetDay)}
                                            className="operating-hours__copy-targets-button"
                                        >
                                            <span>{targetDay}</span>
                                            <Check />
                                        </button>
                                    ))}
                                </div>

                                <QuickCopyButtons day={day} />
                            </div>
                        )}

                        {copiedFrom === day && (
                            <div className="operating-hours__copied-badge">
                                Copied!
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="operating-hours__tips">
                <div className="operating-hours__tips-content">
                    <Calendar />
                    <div>
                        <h4>Quick Tips</h4>
                        <ul>
                            <li>Click the copy icon next to any day to duplicate its hours</li>
                            <li>Use "Copy to Weekdays" for Monday-Friday hours</li>
                            <li>Use "Copy to Weekend" for Saturday-Sunday hours</li>
                            <li>Check "Closed" to mark days when you're not open</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* </div> */}
        </div>
    );
};

export default OperationalInformation;
