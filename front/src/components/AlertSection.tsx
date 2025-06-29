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

/**
 * Seção de alertas com colapso/expansão.
 * Mantém a tela limpa exibindo apenas os 3 primeiros avisos e 
 * permitindo que o usuário revele ou oculte o restante.
 */
const AlertSection: React.FC<AlertSectionProps> = ({ alerts, onDismiss }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleAlerts = showAll ? alerts : alerts.slice(0, MAX_VISIBLE_ALERTS);
  const hiddenCount = alerts.length - visibleAlerts.length;

  return (
    <section
      className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 mb-12 max-w-6xl mx-auto"
      aria-label="Seção de alertas do estoque"
    >
      {/* Lista dinâmica de alertas */}
      <div className="space-y-3" id="alert-list">
        {visibleAlerts.map((alert) => (
          <AlertBanner
            key={alert.index}
            message={alert.message}
            onDismiss={() => onDismiss(alert.index)}
          />
        ))}
      </div>

      {/* Botão Exibir/Ocultar */}
      {alerts.length > MAX_VISIBLE_ALERTS && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll((open) => !open)}
            aria-expanded={showAll}
            aria-controls="alert-list"
            className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-full
                       bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md
                       hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400
                       transition-all duration-200"
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Ocultar alertas
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                Ver mais {hiddenCount} alerta{hiddenCount > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default AlertSection;
