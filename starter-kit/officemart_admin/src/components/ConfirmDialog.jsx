export default function ConfirmDialog({ message, onYes, onNo, busy }) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" data-testid="confirm-dialog">
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" data-testid="confirm-no" onClick={onNo} disabled={busy}>
            Huỷ
          </button>
          <button
            type="button"
            className="danger"
            data-testid="confirm-yes"
            onClick={onYes}
            disabled={busy}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
