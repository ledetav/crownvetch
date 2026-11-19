/**
 * Компонент интерактивной таблицы «Круг общения» для секции «О владельце» (/tz#owner).
 * Отображает сгруппированные контакты («Мои бесто френды» и «Мои любимые северята и не только»),
 * авторские комментарии, кнопки мгновенного копирования ID и ссылки на профили ВК/ТГ
 * со стрелкой в верхний правый угол (↗).
 */
import { useEffect, useRef, useState } from 'react';
import type { OwnerContactGroup } from '../../types/project';
import { ExternalArrowIcon } from '../darkroom/ExternalResourceMenu';

/** Входные свойства таблицы круга общения */
interface SocialCircleTableProps {
  /** Заголовок блока таблицы */
  heading: string;
  /** Массив групп контактов из tzOwner.json */
  groups: OwnerContactGroup[];
  /** Заключительный комментарий под таблицами */
  closingComment: string;
}

/**
 * Компактная иконка буфера обмена для кнопки копирования ID.
 * @returns JSX-иконка копирования.
 */
function CopyGlyphIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15H4V4H15V5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * Копирует строку в буфер обмена с резервным способом для ограниченных окружений.
 * @param text Строка ID для копирования.
 */
async function copyTextSafe(text: string): Promise<void> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Переходим к резервному копированию через временный элемент textarea
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * Отрисовывает правую колонку секции «О владельце» с таблицами контактов и комментариями.
 * @param props Заголовок, группы контактов и нижняя приписка.
 * @returns JSX-разметка реестра круга общения.
 */
export function SocialCircleTable({ heading, groups, closingComment }: SocialCircleTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  /** Фиксирует скопированный ID и сбрасывает визуальный статус через 1.8 секунды */
  const handleCopyId = async (value: string) => {
    await copyTextSafe(value);
    setCopiedId(value);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setCopiedId((current) => (current === value ? null : current));
    }, 1800);
  };

  return (
    <aside className="owner-social-column" aria-label={heading}>
      <div className="owner-social-header">
        <h3 className="dossier-bio__heading">{heading}</h3>
        <span className="owner-social-status" aria-live="polite">
          {copiedId ? `ID ${copiedId} скопирован` : 'Клик по ID — копировать · ↗ профиль'}
        </span>
      </div>

      <div className="owner-tables-grid">
        {groups.map((group) => {
          const hasIds = group.contacts.some((contact) => Boolean(contact.copyId));

          return (
            <div key={group.id} className="social-group-panel">
              <div className="social-group-panel__head">
                <h4 className="social-group-panel__title">{group.title}</h4>
                {group.comment ? (
                  <p className="social-group-panel__comment">{group.comment}</p>
                ) : null}
              </div>

              <div className="social-table-wrap">
                <table className="social-table">
                  <thead>
                    <tr>
                      {hasIds ? <th scope="col">ID</th> : null}
                      <th scope="col">Контакт</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.contacts.map((contact) => {
                      const isCopied = Boolean(contact.copyId && copiedId === contact.copyId);
                      const displayLabel =
                        contact.platform === 'tg' ? `ТГ ${contact.handle.replace(/^t\.me\//, '@')}` : contact.handle;

                      return (
                        <tr key={contact.id}>
                          {hasIds ? (
                            <td className="social-table__id-cell">
                              {contact.copyId ? (
                                <button
                                  type="button"
                                  className={`social-copy-btn ${isCopied ? 'social-copy-btn--copied' : ''}`}
                                  onClick={() => void handleCopyId(contact.copyId!)}
                                  aria-label={`Скопировать ID ${contact.copyId}`}
                                  title="Нажмите, чтобы скопировать ID"
                                >
                                  <span>{isCopied ? 'Скопировано' : contact.copyId}</span>
                                  <CopyGlyphIcon />
                                </button>
                              ) : null}
                            </td>
                          ) : null}

                          <td className="social-table__link-cell">
                            <a
                              href={contact.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`social-profile-link social-profile-link--${contact.platform}`}
                            >
                              <span className="social-profile-link__label">{displayLabel}</span>
                              <ExternalArrowIcon />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <p className="owner-social-closing">{closingComment}</p>
    </aside>
  );
}
