import { AtomIcon, BookOpenTextIcon, CalculatorIcon, DnaIcon, FlaskIcon, GlobeHemisphereWestIcon, ScalesIcon, PaletteIcon, type Icon } from 'phosphor-react-native';
import type { EmojiName } from '../components/Emoji';
import { subjectById } from './catalog';
import { topicsFor } from './bank';

const EMOJI: Record<string, EmojiName> = { english: 'english', mathematics: 'abacus', physics: 'rocket', chemistry: 'science', biology: 'microscope', economics: 'chart', government: 'balanceScale', literature: 'openBook' };
const ICON: Record<string, Icon> = { english: BookOpenTextIcon, mathematics: CalculatorIcon, physics: AtomIcon, chemistry: FlaskIcon, biology: DnaIcon, geography: GlobeHemisphereWestIcon, government: ScalesIcon, literature: PaletteIcon };

export function subjectMeta(id: string) {
  const s = subjectById(id);
  const topics = topicsFor(id);
  return {
    id,
    name: s?.name ?? id,
    color: s?.color ?? 'science',
    emoji: EMOJI[id] ?? (s?.color === 'social' ? 'social' : s?.color === 'arts' ? 'arts' : 'science'),
    icon: ICON[id] ?? BookOpenTextIcon,
    topicsLine: topics.length ? topics.map(t => t.name).slice(0, 3).join(' · ') : 'Questions coming soon',
  } as const;
}
