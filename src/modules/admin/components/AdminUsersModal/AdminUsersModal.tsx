import { useMemo, useState } from 'react';
import { Modal } from '@/shared/components/Modal/Modal';
import { adminUsersService } from '../../services/adminUsers.service';
import type { BulkCreateUserInput, UserRole } from '../../types/admin.types';
import styles from './AdminUsersModal.module.css';

const EMPTY_ROW: BulkCreateUserInput = { nombre: '', codigo: '', rol: 'paciente' };

function normalizeRole(value: string): UserRole | null {
  const v = value.trim().toLowerCase();
  if (v === 'paciente') return 'paciente';
  if (v === 'empleado' || v === 'colaborador') return 'empleado';
  if (v === 'admin') return 'admin';
  return null;
}

function parsePastedRows(text: string): BulkCreateUserInput[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows: BulkCreateUserInput[] = [];

  for (const line of lines) {
    // Permite CSV o TSV: nombre, codigo, rol
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    const [nombreRaw, codigoRaw, rolRaw] = parts.map((p) => (p ?? '').trim());
    if (!nombreRaw && !codigoRaw && !rolRaw) continue;

    const rol = rolRaw ? normalizeRole(rolRaw) : 'paciente';
    rows.push({
      nombre: nombreRaw ?? '',
      codigo: codigoRaw ?? '',
      rol: rol ?? 'paciente',
    });
  }

  return rows;
}

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUsersModal = ({ isOpen, onClose }: AdminUsersModalProps) => {
  const [rows, setRows] = useState<BulkCreateUserInput[]>([{ ...EMPTY_ROW }]);
  const [pasteText, setPasteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const codesInRows = useMemo(() => rows.map((r) => r.codigo.trim()).filter(Boolean), [rows]);

  const duplicatesInRequest = useMemo(() => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const c of codesInRows) {
      const key = c.toLowerCase();
      if (seen.has(key)) dup.add(c);
      seen.add(key);
    }
    return Array.from(dup.values());
  }, [codesInRows]);

  const canSubmit = useMemo(() => {
    const hasAtLeastOneComplete = rows.some(
      (r) => r.nombre.trim() && r.codigo.trim() && !!r.rol
    );
    return hasAtLeastOneComplete && duplicatesInRequest.length === 0 && !isSubmitting;
  }, [rows, duplicatesInRequest.length, isSubmitting]);

  const addEmptyRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

  const removeRow = (idx: number) =>
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length ? next : [{ ...EMPTY_ROW }];
    });

  const updateRow = (idx: number, patch: Partial<BulkCreateUserInput>) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const handleApplyPaste = () => {
    const parsed = parsePastedRows(pasteText);
    if (!parsed.length) return;

    setRows((prev) => {
      const trimmedPrev = prev.filter((r) => r.nombre.trim() || r.codigo.trim());
      return [...trimmedPrev, ...parsed];
    });
    setPasteText('');
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = rows
        .map((r) => ({
          nombre: r.nombre.trim(),
          codigo: r.codigo.trim(),
          rol: r.rol,
        }))
        .filter((r) => r.nombre && r.codigo);

      if (!payload.length) {
        setError('Agrega al menos un usuario completo (nombre, código y rol).');
        return;
      }

      const created = await adminUsersService.bulkCreateUsers(payload);
      setSuccess(`Se crearon ${created.length} usuarios correctamente.`);
      setRows([{ ...EMPTY_ROW }]);
    } catch (e: any) {
      const msg =
        e?.message ||
        'No se pudo crear usuarios. Verifica códigos duplicados o existentes en la base de datos.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Administración · Crear usuarios masivamente" size="xl">
      <div className={styles.topBar}>
        <div className={styles.hint}>
          Pega líneas en formato <strong>nombre,codigo,rol</strong> o <strong>nombre[TAB]codigo[TAB]rol</strong>. Roles
          válidos: <strong>paciente</strong>, <strong>colaborador</strong>, <strong>admin</strong>.
        </div>
      </div>

      <textarea
        className={styles.pasteArea}
        value={pasteText}
        onChange={(e) => setPasteText(e.target.value)}
        placeholder={'Ej:\nJuan Pérez,USER001,paciente\nMaría García,USER002,colaborador'}
      />

      <div className={styles.actions} style={{ marginBottom: 12 }}>
        <button className={styles.btn} type="button" onClick={handleApplyPaste} disabled={!pasteText.trim()}>
          Agregar desde pegado
        </button>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          type="button"
          onClick={() => setRows([{ ...EMPTY_ROW }])}
          disabled={isSubmitting}
        >
          Limpiar
        </button>
      </div>

      {duplicatesInRequest.length > 0 && (
        <div className={`${styles.status} ${styles.error}`}>
          Hay códigos duplicados en el request: {duplicatesInRequest.join(', ')}
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nombre</th>
              <th className={styles.th}>Código</th>
              <th className={styles.th}>Rol</th>
              <th className={styles.th} style={{ width: 120 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td className={styles.td}>
                  <input
                    className={styles.input}
                    value={r.nombre}
                    onChange={(e) => updateRow(idx, { nombre: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={styles.input}
                    value={r.codigo}
                    onChange={(e) => updateRow(idx, { codigo: e.target.value })}
                    placeholder="USER001"
                  />
                </td>
                <td className={styles.td}>
                  <select
                    className={styles.select}
                    value={r.rol}
                    onChange={(e) => {
                      const normalized = normalizeRole(e.target.value) ?? 'paciente';
                      updateRow(idx, { rol: normalized });
                    }}
                  >
                    <option value="paciente">Paciente</option>
                    <option value="empleado">Colaborador</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className={styles.td}>
                  <div className={styles.rowActions}>
                    <button
                      className={`${styles.btn} ${styles.iconButton}`}
                      type="button"
                      onClick={() => removeRow(idx)}
                      disabled={isSubmitting}
                      aria-label="Eliminar fila"
                      title="Eliminar fila"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M4 6H16M8 6V5C8 4.44772 8.44772 4 9 4H11C11.5523 4 12 4.44772 12 5V6M6 6L6.5 16C6.5 16.5523 6.94772 17 7.5 17H12.5C13.0523 17 13.5 16.5523 13.5 16L14 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 9V14M11 9V14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.btn} type="button" onClick={addEmptyRow} disabled={isSubmitting}>
          + Añadir usuario
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? 'Creando...' : 'Crear usuarios'}
        </button>
      </div>

      {(error || success) && (
        <div className={styles.status}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </div>
      )}
    </Modal>
  );
};

