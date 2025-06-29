import React, { useState } from 'react';
import AlertBanner from './AlertBanner';

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
        <>
            {visibleAlerts.map(alert => (
                <AlertBanner
                    key={alert.index}
                    message={alert.message}
                    onDismiss={() => onDismiss(alert.index)} />
            ))}

            {hiddenCount > 0 && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="mt-2 text-sm font-medium text-purple-700 underline">
                    Mostrar mais {hiddenCount} alerta{hiddenCount > 1 ? 's' : ''}
                </button>
            )}

            {showAll && alerts.length > MAX_VISIBLE_ALERTS && (
                <button
                    onClick={() => setShowAll(false)}
                    className="mt-2 text-sm font-medium text-purple-700 underline">
                    Mostrar menos
                </button>
            )}
        </>
    );
};

export default AlertSection;