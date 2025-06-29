import React, { useState } from 'react';
import AlertBanner from './AlertBanner';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const MAX_VISIBLE_ALERTS = 3;

interface Alert {
    index: number;
    message: string;
}

interface AlertSectionProps {
    alerts: Alert[];
    onDismiss: (index: number) => void;
}

const AlertSection: React.FC<AlertSectionProps> = ({ alerts, onDismiss }) => {
    const [showAll, setShowAll] = useState(false);

    const visibleAlerts = showAll ? alerts : alerts.slice(0, MAX_VISIBLE_ALERTS);
    const hiddenCount = alerts.length - visibleAlerts.length;

    return (
        <section className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-10 max-w-8xl mx-auto">
            {/* Lista de Alertas */}
            <div className="space-y-3">
                {visibleAlerts.map((alert) => (
                    <AlertBanner
                        key={alert.index}
                        message={alert.message}
                        onDismiss={() => onDismiss(alert.index)}
                    />
                ))}
            </div>

            {/* Botão Mostrar Mais/Menos */}
            {alerts.length > MAX_VISIBLE_ALERTS && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setShowAll((prev) => !prev)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-5 py-2 rounded-full shadow-md hover:brightness-110 transition-colors duration-200 ease-in-out text-sm"
                    >
                        {showAll ? (
                            <>
                                <ChevronUpIcon className="w-4 h-4" />
                                Mostrar menos
                            </>
                        ) : (
                            <>
                                <ChevronDownIcon className="w-4 h-4" />
                                Mostrar mais {hiddenCount} alerta{hiddenCount > 1 ? 's' : ''}
                            </>
                        )}
                    </button>
                </div>
            )}
        </section>
    );
};

export default AlertSection;
