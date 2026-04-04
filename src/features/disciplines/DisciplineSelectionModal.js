import React from "react";
import { DisciplineGridSelector } from "./DisciplineGridSelector";

export class DisciplineSelectionModal extends React.Component {
  render() {
    const { show, onHide, selectedDisciplineId, onDisciplineChange } =
      this.props;

    if (!show) return null;

    return (
      <div className="fixed inset-0 z-[1050] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
        <div
          className="fixed inset-0 bg-main-bg/80 backdrop-blur-sm transition-opacity"
          onClick={onHide}
        />

        <div className="relative w-full max-w-lg mx-auto my-6 z-[1060] animate-in fade-in zoom-in duration-200">
          <div className="relative flex flex-col w-full bg-card-bg border border-secondary/20 rounded-2xl shadow-2xl outline-none">
            <div className="flex items-center justify-between p-5 border-b border-secondary/10 rounded-t">
              <h3 className="text-xl font-bold text-text-main">
                Выберите направление
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-text-muted hover:text-text-main transition-colors outline-none focus:outline-none"
                onClick={onHide}
              >
                <span className="text-2xl block outline-none">×</span>
              </button>
            </div>

            <div className="relative p-6 flex-auto bg-inner-bg/30">
              <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <DisciplineGridSelector
                  selectedDisciplineId={selectedDisciplineId}
                  onDisciplineChange={(id) => {
                    onDisciplineChange(id);
                    onHide();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
