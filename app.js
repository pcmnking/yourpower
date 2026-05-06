// 1. 核心數據定義
const ELEMENT_MAP = { '金': 'metal', '木': 'wood', '水': 'water', '火': 'fire', '土': 'earth' };
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const CLASHES = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
const HARMS = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
const COMBOS = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };

// 2. 十神運算引擎
const STEM_INFO = {
    '甲': { e: '木', p: '陽' }, '乙': { e: '木', p: '陰' },
    '丙': { e: '火', p: '陽' }, '丁': { e: '火', p: '陰' },
    '戊': { e: '土', p: '陽' }, '己': { e: '土', p: '陰' },
    '庚': { e: '金', p: '陽' }, '辛': { e: '金', p: '陰' },
    '壬': { e: '水', p: '陽' }, '癸': { e: '水', p: '陰' }
};

function getTenGod(target, dm) {
    const t = STEM_INFO[target], d = STEM_INFO[dm];
    if (!t || !d) return '-';
    const sameP = (t.p === d.p);
    const e1 = d.e, e2 = t.e;
    if (e1 === e2) return sameP ? '比肩' : '劫財';
    if (isProduce(e1, e2)) return sameP ? '食神' : '傷官';
    if (isProduce(e2, e1)) return sameP ? '正印' : '正印'; // Note: simplified logic here, actual check below
    // Correcting produce/control logic
    return calculateActualTenGod(target, dm);
}

function calculateActualTenGod(target, dm) {
    const t = STEM_INFO[target], d = STEM_INFO[dm];
    const sameP = (t.p === d.p);
    const e1 = d.e, e2 = t.e;
    if (e1 === e2) return sameP ? '比肩' : '劫財';
    if (isProduce(e1, e2)) return sameP ? '食神' : '傷官';
    if (isProduce(e2, e1)) return sameP ? '偏印' : '正印';
    if (isControl(e1, e2)) return sameP ? '偏財' : '正財';
    if (isControl(e2, e1)) return sameP ? '七殺' : '正官';
    return '-';
}

function isProduce(a, b) { return { '木':'火','火':'土','土':'金','金':'水','水':'木' }[a] === b; }
function isControl(a, b) { return { '木':'土','土':'水','水':'火','火':'金','金':'木' }[a] === b; }

// 3. 象意資料庫
const XIANG_YI = {
    '比肩': { 
        'year': '出身平民家庭，祖上或父輩多為自力更生之人。幼年時期易與兄弟姊妹競爭資源，需獨立自主。', 
        'month': '性格自我意識極強，不願受人擺佈。兄弟姊妹間感情雖好，但易有經濟或意見上的爭執，適合外鄉發展。', 
        'day': '夫妻關係如兄如弟，配偶性格剛毅獨立。感情生活平淡，少浪漫，易因堅持己見而產生磨擦。', 
        'hour': '子女個性獨立，晚年生活忙碌但充實。多為白手起家之命，晚年需防財產被後輩爭奪。' 
    },
    '劫財': { 
        'year': '祖產難守，早年家境易生變故。幼時性格頑皮，與父親緣分較薄，家長需注意財務管理。', 
        'month': '為人豪爽大方，好交朋友。但財務壓力大，常有意外開銷。事業競爭激烈，需防小人奪財。', 
        'day': '婚姻生活多波折，易有第三者干擾或因財失和。配偶性格急躁，雙方需多溝通包容。', 
        'hour': '晚年財運起伏較大，不宜從事高風險投資。子女個性倔強，需注重親子教育與溝通。' 
    },
    '食神': { 
        'year': '祖上豐盈，幼年受長輩疼愛。體質好，福氣深，童年生活無憂無慮，多才多藝。', 
        'month': '事業發展平順，適合從事餐飲、藝術、教育或服務業。人脈廣，易得貴人提拔。', 
        'day': '配偶賢惠體貼，有口福。婚姻生活和諧，家庭氣氛溫馨，是一生幸福的基石。', 
        'hour': '晚年福澤深厚，子女孝順且有成就。晚年生活優渥，心態樂觀長壽。' 
    },
    '傷官': { 
        'year': '祖輩多才但易有大起大落。幼年性格叛逆，聰明過人但易受傷，宜學習一技之長以安身。', 
        'month': '才華橫溢，創意無窮，但不喜受約束。職場上易與上司發生口角，適合創業或自由職業。', 
        'day': '配偶相貌出眾且多才多藝，但性格挑剔，感情生活多磨合。婚姻需防口舌是非。', 
        'hour': '子女聰穎過人，具備領袖氣質。晚年仍有強烈事業心，但需注意健康與心態調整。' 
    },
    '正財': { 
        'year': '出身富裕或書香門第，祖上根基穩固。幼年受良好教育，理財觀念建立較早。', 
        'month': '工作踏實，財源穩定。家庭觀念重，做事謹慎，適合在公家機關或大型企業發展。', 
        'day': '配偶理財有道，能助一步之力。婚姻穩定，男命易得賢內助，家庭生活幸福美滿。', 
        'hour': '晚年財庫充裕，子女成才且孝順。遺產豐厚，晚景安逸無憂。' 
    },
    '偏財': { 
        'year': '祖上經商獲利，幼年家境優渥。父緣深厚，早年即展露經商天賦與外交手腕。', 
        'month': '財源廣進，人緣極佳。適合從事投資、金融或仲介業務。性格慷慨，易得意外之財。', 
        'day': '配偶性格外向，善於交際。感情生活豐富多彩，但也容易因為外界誘惑而產生動盪。', 
        'hour': '財力雄厚，子女具備經商才能。晚年仍有投資機會，財富不斷流向後代。' 
    },
    '正官': { 
        'year': '出身名門或官宦之家，家教嚴格。幼年表現優異，深得老師與長輩器重。', 
        'month': '仕途平順，權力欲望強。性格端莊，重視名譽與社會地位。適合從事行政管理或法律工作。', 
        'day': '配偶性格穩重，家庭地位高。婚姻生活規範，雙方相敬如賓，是一生名譽的保障。', 
        'hour': '子女優秀，晚年受人尊敬。後輩多在公門或主流社會發展，家族名聲得以延續。' 
    },
    '七殺': { 
        'year': '祖上威嚴，家風嚴厲。早年身體較弱或壓力較大，多經歷磨練，能養成剛毅性格。', 
        'month': '敢打敢拼，事業心極強。在競爭激烈的環境中能脫穎而出，但需嚴防小人暗算與是非。', 
        'day': '配偶性格倔強，雙方易有權力之爭。婚姻生活充滿挑戰，需以柔克剛方能長久。', 
        'hour': '子女果斷勇敢，具備軍警或體育天賦。晚年性格威嚴，但需注意健康與性格暴躁。' 
    },
    '正印': { 
        'year': '出身文化家庭，祖上有德。受母親或長輩疼愛，幼年學習成績優異，深具福氣。', 
        'month': '思維敏捷，貴人緣深。適合從事教育、研究或管理工作。一生逢凶化吉，有良好的社會名聲。', 
        'day': '配偶體貼入微，具備母性慈輝。婚姻生活安穩，長輩支持力度大，是精神生活的依靠。', 
        'hour': '子女好學向上，晚年生活安詳。受人敬仰，心靈追求高尚，長壽安康。' 
    },
    '偏印': { 
        'year': '祖上多具備獨特才藝或醫術。幼年性格內向敏感，思維獨特，與長輩緣分較淡或受管教較多。', 
        'month': '领悟力極強，適合從事冷門技術或宗教哲學研究。性格孤僻但內心強大，容易在特定領域成功。', 
        'day': '配偶性格特立獨行，思維跳躍。婚姻生活多有神祕感，雙方需保持精神交流。', 
        'hour': '子女具備獨特天分，發展路徑與眾不同。晚年研究興趣濃厚，生活獨立自主。' 
    }
};

const INTERACTION_TEXT = {
    '沖': '代表變動、對立、衝突。人生易有突如其來的改變。',
    '害': '代表牽絆、暗中損害。付出多回報少。',
    '合': '代表和諧、吸引、凝聚。易得人助，但也代表牽制。',
    '刑': '代表磨擦、是非、心理矛盾或外界阻礙。',
    '自刑': '代表自我矛盾、內耗、鑽牛角尖。'
};

const DEFICIENCY_NOTES = {
    '正財': '理財較隨緣。', '偏財': '意外財源少。', '正官': '不喜束縛。', '七殺': '缺乏魄力。',
    '正印': '安全感薄弱。', '偏印': '思維大眾化。', '食神': '生活情趣少。', '傷官': '缺乏冒險。',
    '比肩': '社交圈小。', '劫財': '競爭意識薄。'
};

const LUCK_XIANG_YI = {
    '比肩': '主社交、同輩競爭。利於擴展人脈，但需防開支增加或與人爭執。',
    '劫財': '主財源變動、競爭。需嚴防投機行為及意外破財，保持低調為宜。',
    '食神': '主福氣、才華、口福。利於創意發揮、旅遊或創業，心境較為悠閒。',
    '傷官': '主變動、創意、口舌。利於改革或展示才華，但需注意與上司或長輩的關係。',
    '正財': '主正財、穩定、家庭。財運穩定，利於工作獲益或處理家庭事務。',
    '偏財': '主橫財、投機、機遇。財運起伏較大，利於經商或投資，但需見好就收。',
    '正官': '主事業、名聲、責任。利於職位晉升、考學或公職，但壓力較大。',
    '七殺': '主挑戰、小人、壓力。事業多競爭與阻礙，需注意身體健康與是非困擾。',
    '正印': '主貴人、學業、長輩。利於學習進修、買房或受人提拔，心靈較安穩。',
    '偏印': '主獨特才華、靈感、孤獨。利於非傳統研究，但易想太多，行動力稍弱。'
};

const BRANCH_TO_STEM = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
    '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
};

const BRANCH_HIDE_GANS = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'], '卯': ['乙'],
    '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'], '午': ['丁', '己'], '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'], '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

function createManualBazi(y, m, d, h) {
    return {
        getYear: () => [y[0], y[1]],
        getMonth: () => [m[0], m[1]],
        getDay: () => [d[0], d[1]],
        getHour: () => [h[0], h[1]],
        getTime: () => [h[0], h[1]],
        getYearHideGan: () => BRANCH_HIDE_GANS[y[1]] || [],
        getMonthHideGan: () => BRANCH_HIDE_GANS[m[1]] || [],
        getDayHideGan: () => BRANCH_HIDE_GANS[d[1]] || [],
        getTimeHideGan: () => BRANCH_HIDE_GANS[h[1]] || []
    };
}

const ACTION_ENERGY_RULES = [
    { id: '食神剋官', n: '挑戰傳統型', d: '具備獨特視角，喜歡挑戰僵化制度。行動上需有專業實力支撐，否則易流於挑剔。', check: (g) => g.includes('食神') && (g.includes('正官') || g.includes('七殺')) },
    { id: '財剋印', n: '渴求關注型', d: '內心缺乏安定感，會以積極熱情向外索求保護與關注。需防範因暴露弱點而受騙。', check: (g) => (g.includes('正財') || g.includes('偏財')) && (g.includes('正印') || g.includes('偏印')) },
    { id: '比劫剋財', n: '慷慨分享型', d: '重情重義，將人際關係看得比金錢重要。樂於分享資源，但需分清真心與面子。', check: (g) => (g.includes('比肩') || g.includes('劫財')) && (g.includes('正財') || g.includes('偏財')) },
    { id: '印生比劫', n: '溫和配合型', d: '態度柔和體貼，願意為了和諧而放下主觀意識配合他人。重視朋友但有守財意識。', check: (g) => (g.includes('正印') || g.includes('偏印')) && (g.includes('比肩') || g.includes('劫財')) },
    { id: '印剋食傷', n: '過度理性型', d: '行動過度謹慎，做事較慢且易自我壓抑。因過度理性易招惹小人，需放鬆心態。', check: (g) => (g.includes('正印') || g.includes('偏印')) && (g.includes('食神') || g.includes('傷官')) },
    { id: '食傷生財', n: '追求認同型', d: '強烈的表達慾望，積極傳達理念以獲得大眾目光與崇拜。非常願意配合環境需求。', check: (g) => (g.includes('食神') || g.includes('傷官')) && (g.includes('正財') || g.includes('偏財')) },
    { id: '官殺制比劫', n: '爭強好勝型', d: '在意外界看法，行動上帶有強烈的競爭意識，傾向於在同儕中脫穎而出或超越他人。', check: (g) => (g.includes('正官') || g.includes('七殺')) && (g.includes('比肩') || g.includes('劫財')) },
    { id: '傷官洩秀', n: '追求自由型', d: '思路清晰且內在底蘊深厚。討厭受權威壓迫，渴望在無壓力的環境下自由發揮。', check: (g) => g.includes('傷官') && g.filter(x => x === '傷官').length >= 1 }
];

let currentBazi = null;
let currentGender = 1;
let currentDaYunList = [];
let selectedDaYunIndex = -1;

window.onload = () => { initSelects(); };
function getElement(char) { return STEM_INFO[char]?.e || (['子','亥'].includes(char)?'水':['寅','卯'].includes(char)?'木':['巳','午'].includes(char)?'火':['申','酉'].includes(char)?'金':'土'); }

function initSelects() {
    ['y', 'm', 'd', 'h'].forEach(p => {
        const sEl = document.getElementById(`${p}Stem`), bEl = document.getElementById(`${p}Branch`);
        if (sEl && bEl) { 
            STEMS.forEach(s => {
                const opt = new Option(s, s);
                opt.className = ELEMENT_MAP[getElement(s)];
                sEl.add(opt);
            }); 
            BRANCHES.forEach(b => {
                const opt = new Option(b, b);
                opt.className = ELEMENT_MAP[getElement(b)];
                bEl.add(opt);
            }); 
        }
    });
}

function switchInput(type) {
    document.getElementById('dateInput').style.display = type === 'date' ? 'grid' : 'none';
    document.getElementById('manualInput').style.display = type === 'manual' ? 'grid' : 'none';
}

const TEN_GOD_DETAILS = {
    '比肩': '【特質】代表自我、自尊與競爭。您是一個非常有主見的人，不喜歡隨波逐流，凡事喜歡靠自己。\\n【優點】獨立自主、剛毅果斷、自我要求高。\\n【缺點】有時過於固執，容易給人孤傲的感覺，在人際關係中較不擅長圓滑處理。\\n【給命主的建議】您適合創業或獨立作業，但在團體中需學會放下身段，適度接納他人意見。',
    '劫財': '【特質】代表強烈的意志力與社交能力。您具有冒險精神，對朋友豪爽，但內心常有矛盾感。\\n【優點】應變能力強、具備執行力、不懼挑戰。\\n【缺點】錢財易來易去，容易因為義氣或衝動而破財，性格雙重。\\n【給命主的建議】財務管理是您的必修課，建議將資金投入固定資產，並謹慎選擇合夥對象。',
    '食神': '【特質】代表才華、福氣與享受。您是天生的「福星」，重視精神生活與物質享受，性格溫和。\\n【優點】多才多藝、寬宏大量、人緣極佳、生活優雅。\\n【缺點】有時會顯得缺乏上進心，或過於沈溺於享樂而錯失良機。\\n【給命主的建議】您的才華是最大的財富，適合在輕鬆、具備創意的環境下發展，保持積極性能讓福報加倍。',
    '傷官': '【特質】代表卓越的創意與表達力。您思維敏捷，不甘於平凡，敢於挑戰傳統與權威。\\n【優點】聰明絕頂、反應極快、具備藝術天賦與領袖氣質。\\n【缺點】性格較為叛逆，言語鋒利易得罪人，常有懷才不遇之感。\\n【給命主的建議】「收斂光芒」是您的開運關鍵，在發揮才華的同時，多給他人留餘地，事業將會更加順遂。',
    '正財': '【特質】代表穩定的財運與責任感。您是一個踏實的人，重視信用，相信「一分耕耘，一分收穫」。\\n【優點】勤奮節儉、做事嚴謹、家庭觀念極強、經濟穩定。\\n【缺點】有時過於保守，對金錢計較較多，缺乏變通力與冒險心。\\n【給命主的建議】您的財富來源於穩定的積累，適合在體制完善的企業發展，適當的理財投資能讓資產穩健增長。',
    '偏財': '【特質】代表意外之財與靈活的手腕。您具備敏銳的商機嗅覺，善於交際，喜歡追求高回報。\\n【優點】慷慨大方、眼光獨到、人際關係廣闊、財源多元。\\n【缺點】財來財去不穩定，容易產生投機心態，生活較為風流不羈。\\n【給命主的建議】「見好就收」是理財格言。您的財富在於流動與整合，保持良好的人格信用，財富將自四方而來。',
    '正官': '【特質】代表名譽、地位與紀律。您重視道德規範，有強烈的責任心與使命感，是社會的中堅力量。\\n【優點】為人公正、遵守法律、事業心強、受人尊敬。\\n【缺點】生活過於嚴肅刻板，容易給自己太大壓力，甚至顯得因循守舊。\\n【給命主的建議】您適合從事公職或管理階層。在追求事業高度的同時，也要學會放鬆身心，適度打破規矩或許有新發現。',
    '七殺': '【特質】代表權威、魄力與變革。您具備強大的開拓精神，勇於面對壓力，能在逆境中爆發出驚人的能量。\\n【優點】果敢堅強、具備統率力、做事雷厲風行、不畏艱辛。\\n【缺點】性格過於激進，疑心較重，易招惹是非與小人，生活壓力大。\\n【給命主的建議】「以和為貴」能化解許多不必要的鬥爭。您的成功在於不斷超越自我，但需注意健康與情緒管理。',
    '正印': '【特質】代表守護、學術與名譽。您性格善良慈悲，好學不倦，一生中常有長輩或貴人相助。\\n【優點】穩重踏實、知書達禮、逢凶化吉、內心平靜。\\n【缺點】依賴性較強，缺乏開創性與魄力，有時會顯得優柔寡斷。\\n【給命主的建議】持續的學習與精神追求是您的力量來源。適合在文化、教育、慈善等領域發展，貴人運將助您平步青雲。',
    '偏印': '【特質】代表敏銳的直覺與獨特的才藝。您思維獨特，領悟力極高，常能洞察到他人察覺不到的細節。\\n【優點】具備奇才、洞察力敏銳、精明能幹、獨具風格。\\n【缺點】性格較為孤僻、多疑，易鑽牛角尖，與他人較有距離感。\\n【給命主的建議】您的獨特性是最大的優勢。適合研發、設計、命理或心理諮商等領域，開放心胸能讓您獲得更多共鳴。'
};

function showTenGodDetail(name) {
    if (!TEN_GOD_DETAILS[name]) return;
    const modal = document.getElementById('tenGodModal');
    const content = document.getElementById('draggableModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.innerText = `十神詳解 - ${name}`;
    let html = `<p style="margin-bottom:1rem;">${TEN_GOD_DETAILS[name]}</p>`;
    if (XIANG_YI[name]) {
        html += `<h3 style="color:var(--accent-blue); margin:1rem 0 0.5rem 0;">🏠 命盤位詳解：</h3>`;
        html += `<ul style="padding-left:1.2rem;">
            <li><strong>年柱：</strong>${XIANG_YI[name].year}</li>
            <li><strong>月柱：</strong>${XIANG_YI[name].month}</li>
            <li><strong>日柱：</strong>${XIANG_YI[name].day}</li>
            <li><strong>時柱：</strong>${XIANG_YI[name].hour}</li>
        </ul>`;
    }
    if (LUCK_XIANG_YI[name]) {
        html += `<h3 style="color:var(--accent-blue); margin:1.5rem 0 0.5rem 0;">📅 運勢象意：</h3>`;
        html += `<p>${LUCK_XIANG_YI[name]}</p>`;
    }
    body.innerHTML = html;
    modal.style.display = 'block';
    content.style.top = '150px';
    content.style.left = '50%';
    content.style.transform = 'translateX(-50%)';
}

function closeModal() { document.getElementById('tenGodModal').style.display = 'none'; }

let isDragging = false, dragOffset = { x: 0, y: 0 };
document.addEventListener('mousedown', (e) => {
    const content = document.getElementById('draggableModal');
    if (e.target.closest('#modalHeader')) {
        isDragging = true;
        const rect = content.getBoundingClientRect();
        dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        content.style.transform = 'none';
        content.style.left = rect.left + 'px';
        content.style.top = rect.top + 'px';
        content.style.margin = '0';
    }
});
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const content = document.getElementById('draggableModal');
    content.style.left = (e.clientX - dragOffset.x) + 'px';
    content.style.top = (e.clientY - dragOffset.y) + 'px';
});
document.addEventListener('mouseup', () => { isDragging = false; });

function calculateByDate() {
    try {
        const d = document.getElementById('birthDate').value, t = document.getElementById('birthTime').value;
        const g = parseInt(document.getElementById('gender').value);
        if (!d || !t) return;
        const [yy, mm, dd] = d.split('-').map(Number), [hh, mi] = t.split(':').map(Number);
        const solar = Solar.fromYmdHms(yy, mm, dd, hh, mi, 0), lunar = solar.getLunar();
        currentBazi = lunar.getEightChar(); currentGender = g;
        displayResult(currentBazi);
        initLuckModule(lunar, g);
    } catch (e) { alert("運算失敗: " + e.message); }
}

function calculateByManual() {
    try {
        const y = document.getElementById('yStem').value + document.getElementById('yBranch').value;
        const m = document.getElementById('mStem').value + document.getElementById('mBranch').value;
        const d = document.getElementById('dStem').value + document.getElementById('dBranch').value;
        const h = document.getElementById('hStem').value + document.getElementById('hBranch').value;
        currentBazi = createManualBazi(y, m, d, h);
        currentDaYunList = [];
        document.getElementById('dayunList').innerHTML = '<p style="padding:10px;">手動輸入不支援大運</p>';
        document.getElementById('liunianList').innerHTML = '';
        document.getElementById('liuyueList').innerHTML = '';
        document.getElementById('luckAnalysisResult').innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">請使用生辰輸入</p>';
        displayResult(currentBazi);
    } catch (e) { alert("手動轉換失敗: " + e.message); }
}

function initLuckModule(lunar, gender) {
    try {
        const yun = lunar.getEightChar().getYun(gender);
        // 先取得原始列表，並過濾掉沒有干支的無效項 (如部分極端邊界情況)
        // 顯示到約 100 歲 (12 個週期)
        currentDaYunList = yun.getDaYun().slice(0, 12).filter(dy => dy.getGanZhi()); 
        
        const dm = currentBazi.getDay()[0];
        
        document.getElementById('dayunList').innerHTML = currentDaYunList.map((dy, i) => {
            const gz = dy.getGanZhi();
            const tg = getTenGod(gz[0], dm);
            const sElem = ELEMENT_MAP[getElement(gz[0])], bElem = ELEMENT_MAP[getElement(gz[1])];
            const startAge = dy.getStartAge();
            const ageLabel = startAge === 0 ? '出生' : `${startAge}歲`;
            
            return `
                <div class="luck-item" onclick="selectDaYun(${i})">
                    <span class="${sElem}">${gz[0]}</span>
                    <span class="${bElem}">${gz[1]}</span>
                    <small class="ten-god" onclick="event.stopPropagation(); showTenGodDetail('${tg}')">[${tg}]</small>
                    <span>${ageLabel}起</span>
                </div>`;
        }).join('');
        
        selectDaYun(0);
    } catch (e) { console.error("大運初始化失敗:", e); }
}

function selectDaYun(index) {
    selectedDaYunIndex = index;
    document.querySelectorAll('#dayunList .luck-item').forEach((item, i) => item.classList.toggle('active', i === index));
    const dy = currentDaYunList[index];
    if (!dy) return;
    const lnList = dy.getLiuNian(), dm = currentBazi.getDay()[0];
    
    if (lnList && lnList.length > 0) {
        document.getElementById('liunianList').innerHTML = lnList.map(ln => {
            const gz = ln.getGanZhi(), tg = getTenGod(gz[0], dm);
            const sElem = ELEMENT_MAP[getElement(gz[0])], bElem = ELEMENT_MAP[getElement(gz[1])];
            return `<div class="luck-item" onclick="selectLiuNian(${ln.getYear()}, '${gz[0]}', '${gz[1]}')"><span class="${sElem}">${gz[0]}</span><span class="${bElem}">${gz[1]}</span><small class="ten-god" onclick="event.stopPropagation(); showTenGodDetail('${tg}')">[${tg}]</small><span>${ln.getYear()}</span></div>`;
        }).join('');
        selectLiuNian(lnList[0].getYear(), lnList[0].getGanZhi()[0], lnList[0].getGanZhi()[1]);
    } else {
        document.getElementById('liunianList').innerHTML = '<p style="padding:10px;">查無流年數據</p>';
        document.getElementById('liuyueList').innerHTML = '';
    }
}

function selectLiuNian(year, gan, zhi) {
    document.querySelectorAll('#liunianList .luck-item').forEach(item => item.classList.toggle('active', item.innerText.includes(year.toString())));
    const dy = currentDaYunList[selectedDaYunIndex];
    if (!dy) return;
    const ln = dy.getLiuNian().find(l => l.getYear() === year);
    if (!ln) return;
    
    const lyList = ln.getLiuYue(), dm = currentBazi.getDay()[0];
    const branchNames = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    const westernApprox = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1'];
    
    if (lyList && lyList.length > 0) {
        document.getElementById('liuyueList').innerHTML = lyList.map((ly, i) => {
            const gz = ly.getGanZhi(), tg = getTenGod(gz[0], dm), sElem = ELEMENT_MAP[getElement(gz[0])], bElem = ELEMENT_MAP[getElement(gz[1])], idx = ly.getIndex();
            return `<div class="luck-item" onclick="selectLiuYue(${i}, '${gz[0]}', '${gz[1]}')"><span class="${sElem}">${gz[0]}</span><span class="${bElem}">${gz[1]}</span><small class="ten-god" onclick="event.stopPropagation(); showTenGodDetail('${tg}')">[${tg}]</small><span>${branchNames[idx]}月 (約${westernApprox[idx]}月)</span></div>`;
        }).join('');
        window.currentSelectedLuck = { year, gan, zhi, dy };
        selectLiuYue(0, lyList[0].getGanZhi()[0], lyList[0].getGanZhi()[1]);
    } else {
        document.getElementById('liuyueList').innerHTML = '<p style="padding:10px;">查無流月數據</p>';
    }
}

function selectLiuYue(index, mGan, mZhi) {
    document.querySelectorAll('#liuyueList .luck-item').forEach((item, i) => item.classList.toggle('active', i === index));
    const { year, gan, zhi, dy } = window.currentSelectedLuck, dm = currentBazi.getDay()[0], dyGZ = dy.getGanZhi();
    const luckGods = { dyS: getTenGod(dyGZ[0], dm), dyB: getTenGod(BRANCH_TO_STEM[dyGZ[1]], dm), lnS: getTenGod(gan, dm), lnB: getTenGod(BRANCH_TO_STEM[zhi], dm), lyS: getTenGod(mGan, dm), lyB: getTenGod(BRANCH_TO_STEM[mZhi], dm) };
    const b = currentBazi;
    const originalGods = [];
    const call = (sfx) => {
        const h = `getHour${sfx}`, t = `getTime${sfx}`;
        return (typeof b[h] === 'function') ? b[h]() : (typeof b[t] === 'function' ? b[t]() : null);
    };
    [b.getYear(), b.getMonth(), b.getDay(), (call('')||['',''])].forEach(p => {
        originalGods.push(getTenGod(p[0], dm));
        originalGods.push(getTenGod(BRANCH_TO_STEM[p[1]], dm));
    });
    const currentActiveGods = [...originalGods, luckGods.dyS, luckGods.dyB, luckGods.lnS, luckGods.lnB, luckGods.lyS, luckGods.lyB];
    const activeEnergies = ACTION_ENERGY_RULES.filter(rule => rule.check(currentActiveGods)).map(rule => {
        const triggers = currentActiveGods.filter(g => rule.id.includes(g.substring(0,2)) || rule.id.includes(g));
        return { ...rule, triggers: [...new Set(triggers)].join('、') };
    });
    const pillars = [ { n: '年', b: b.getYear()[1] }, { n: '月', b: b.getMonth()[1] }, { n: '日', b: b.getDay()[1] }, { n: '時', b: (call('')||['',''])[1] } ];
    let rawInters = [];
    pillars.forEach(p => {
        const dR = checkBranchRelation(dyGZ[1], p.b, `大運`, p.n); if (dR) rawInters.push(...dR);
        const lR = checkBranchRelation(zhi, p.b, `流年`, p.n); if (lR) rawInters.push(...lR);
        const mR = checkBranchRelation(mZhi, p.b, `流月`, p.n); if (mR) rawInters.push(...mR);
    });
    const luckInters = []; const seen = new Set();
    rawInters.forEach(item => { if (!seen.has(item.tag)) { luckInters.push(item); seen.add(item.tag); } });
    
    document.getElementById('luckAnalysisResult').innerHTML = `
        <div class="luck-pillar-display" style="gap: 10px;">
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">大運</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.dyS}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.dyS}</div><div class="character stem ${ELEMENT_MAP[getElement(dyGZ[0])]}">${dyGZ[0]}</div><div class="character branch ${ELEMENT_MAP[getElement(dyGZ[1])]}">${dyGZ[1]}</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.dyB}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.dyB}</div></div>
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">流年</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.lnS}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lnS}</div><div class="character stem ${ELEMENT_MAP[getElement(gan)]}">${gan}</div><div class="character branch ${ELEMENT_MAP[getElement(zhi)]}">${zhi}</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.lnB}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lnB}</div></div>
            <div class="luck-pillar-item" style="flex: 1;"><div class="p-label">流月</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.lyS}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lyS}</div><div class="character stem ${ELEMENT_MAP[getElement(mGan)]}">${mGan}</div><div class="character branch ${ELEMENT_MAP[getElement(mZhi)]}">${mZhi}</div><div class="ten-god" onclick="showTenGodDetail('${luckGods.lyB}')" style="color:var(--primary-gold); font-weight:800; font-size:0.75rem;">${luckGods.lyB}</div></div>
        </div>
        <div class="analysis-section">
            <h4 class="sub-title">⚡ 運勢行為慣性</h4>
            <div class="remedy-box" style="margin-bottom: 1.5rem; padding: 1rem;">
                ${activeEnergies.length > 0 ? activeEnergies.slice(0, 2).map(e => `<div style="margin-bottom:12px;"><strong>【${e.n}】</strong><small style="color:var(--primary-gold); display:block;">(${e.id} - ${e.triggers})</small><p style="font-size:0.8rem; margin-top:5px; opacity:0.9;">${e.d}</p></div>`).join('') : '<p>當前行為模式平穩。</p>'}
            </div>
            <h4 class="sub-title">🔮 運勢與原局互動</h4>
            <div class="remedy-box" style="padding: 1rem;">
                ${luckInters.length > 0 ? luckInters.map(it => `<div style="margin-bottom: 8px;"><span class="${it.type === '合' ? 'success' : 'danger'}">${it.tag}</span><p style="font-size: 0.8rem; color: #cbd5e1;">${INTERACTION_TEXT[it.type]}</p></div>`).join('') : '<p>氣場平穩。</p>'}
            </div>
        </div>`;
}

function checkBranchRelation(b1, b2, n1, n2) {
    const l = `${n1}[${b1}] 與 ${n2}[${b2}]`, res = [];
    if (CLASHES[b1] === b2) res.push({ tag: `${l} 相沖`, type: '沖' });
    if (HARMS[b1] === b2) res.push({ tag: `${l} 相害`, type: '害' });
    if (COMBOS[b1] === b2) res.push({ tag: `${l} 相合`, type: '合' });
    if ((b1==='子'&&b2==='卯')||(b1==='卯' && b2==='子')) res.push({ tag: `${l} 相刑`, type: '刑' });
    if (['寅','巳','申'].includes(b1)&&['寅','巳','申'].includes(b2)&&b1!==b2) res.push({ tag: `${l} 相刑`, type: '刑' });
    if (['丑','戌','未'].includes(b1)&&['丑','戌','未'].includes(b2)&&b1!==b2) res.push({ tag: `${l} 相刑`, type: '刑' });
    return res.length > 0 ? res : null;
}

function displayResult(bazi) {
    const res = document.getElementById('resultSection'); res.style.display = 'block';
    const dm = bazi.getDay()[0];
    const call = (sfx) => {
        const h = `getHour${sfx}`, t = `getTime${sfx}`;
        return (typeof bazi[h] === 'function') ? bazi[h]() : (typeof bazi[t] === 'function' ? bazi[t]() : null);
    };
    const pillars = [
        { id: 'year', s: bazi.getYear()[0], b: bazi.getYear()[1], h: bazi.getYearHideGan(), sg: getTenGod(bazi.getYear()[0], dm), bg: getTenGod(bazi.getYearHideGan()[0], dm) },
        { id: 'month', s: bazi.getMonth()[0], b: bazi.getMonth()[1], h: bazi.getMonthHideGan(), sg: getTenGod(bazi.getMonth()[0], dm), bg: getTenGod(bazi.getMonthHideGan()[0], dm) },
        { id: 'day', s: dm, b: bazi.getDay()[1], h: bazi.getDayHideGan(), sg: '日主', bg: getTenGod(bazi.getDayHideGan()[0], dm) },
        { id: 'hour', s: (call('')||[' ',' '])[0], b: (call('')||[' ',' '])[1], h: call('HideGan')||[], sg: getTenGod((call('')||[' ',' '])[0], dm), bg: getTenGod((call('HideGan')||[])[0], dm) }
    ];
    pillars.forEach(p => {
        document.getElementById(`${p.id}Stem`).textContent = p.s; document.getElementById(`${p.id}Stem`).className = `character stem ${ELEMENT_MAP[getElement(p.s)]}`;
        document.getElementById(`${p.id}Branch`).textContent = p.b; document.getElementById(`${p.id}Branch`).className = `character branch ${ELEMENT_MAP[getElement(p.b)]}`;
        document.getElementById(`${p.id}Hidden`).innerHTML = (p.h || []).map(h => `<div class="hidden-item"><span class="${ELEMENT_MAP[getElement(h)]}">${h}</span><small class="ten-god" onclick="showTenGodDetail('${getTenGod(h, dm)}')">[${getTenGod(h, dm)}]</small></div>`).join('');
        if (document.getElementById(`${p.id}StemTenGod`)) {
            const el = document.getElementById(`${p.id}StemTenGod`); el.textContent = p.sg;
            if (p.sg !== '日主') el.onclick = () => showTenGodDetail(p.sg);
        }
        if (document.getElementById(`${p.id}BranchTenGod`)) {
            const el = document.getElementById(`${p.id}BranchTenGod`); el.textContent = p.bg; el.onclick = () => showTenGodDetail(p.bg);
        }
    });
    calculateXiYongShen({ pillars }); generateAnalysis({ pillars }); renderRelationshipDiagrams(dm);
    window.scrollTo({ top: res.offsetTop - 50, behavior: 'smooth' });
}

function renderRelationshipDiagrams(dm) {
    const drawPentagon = (containerId, title, nodes, colors, subLabels = []) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.setAttribute('data-title', title);
        
        const size = 800; // 巨型畫布
        const center = size / 2;
        const radius = 260; // 巨型半徑
        const points = [];
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - (Math.PI / 2);
            points.push({
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
                label: nodes[i],
                sub: subLabels[i] || '',
                color: colors[i]
            });
        }
        
        let svg = `<svg class="diagram-svg" viewBox="0 0 ${size} ${size}">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                    <polygon points="0 0, 10 4, 0 8" fill="currentColor" />
                </marker>
            </defs>`;
        
        // 畫線：相生與相剋
        points.forEach((p, i) => {
            const next = points[(i + 1) % 5];
            const dx = next.x - p.x, dy = next.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const offset = 95; // 節點半徑 85 + 10 間隙
            const x1 = p.x + (dx / dist) * offset;
            const y1 = p.y + (dy / dist) * offset;
            const x2 = next.x - (dx / dist) * offset;
            const y2 = next.y - (dy / dist) * offset;
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="diagram-arrow arrow-produce" style="color:var(--text-secondary)" />`;
        });
        
        points.forEach((p, i) => {
            const next = points[(i + 2) % 5];
            const dx = next.x - p.x, dy = next.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const offset = 95;
            const x1 = p.x + (dx / dist) * offset;
            const y1 = p.y + (dy / dist) * offset;
            const x2 = next.x - (dx / dist) * offset;
            const y2 = next.y - (dy / dist) * offset;
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="diagram-arrow arrow-control" style="color:var(--color-fire)" />`;
        });
        
        // 畫節點與文字
        points.forEach(p => {
            const labels = p.label.split(' ');
            svg += `
                <circle cx="${p.x}" cy="${p.y}" r="85" fill="rgba(15, 23, 42, 0.95)" stroke="${p.color}" stroke-width="6" />
                <text x="${p.x}" y="${p.y - (labels.length > 1 ? 15 : 0)}" class="diagram-node" style="fill:${p.color}">
                    ${labels.map((l, idx) => `<tspan x="${p.x}" dy="${idx === 0 ? '0.3em' : '1.2em'}">${l}</tspan>`).join('')}
                </text>
                ${p.sub ? `<text x="${p.x}" y="${p.y + 125}" style="fill:var(--text-secondary); font-size:24px; font-weight:bold;" text-anchor="middle">${p.sub}</text>` : ''}
            `;
        });
        
        svg += `</svg>`;
        container.innerHTML = svg;
    };

    const fiveElements = ['木', '火', '土', '金', '水'];
    const elementColors = ['#10b981', '#ef4444', '#d97706', '#cbd5e1', '#3b82f6'];
    drawPentagon('fiveElementsDiagram', '五行生剋圖', fiveElements, elementColors);

    const dmElem = getElement(dm);
    const order = [dmElem];
    const produceChain = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
    let curr = dmElem;
    for(let i=0; i<4; i++) { curr = produceChain[curr]; order.push(curr); }
    
    const godFullNames = ['比肩 劫財', '食神 傷官', '偏財 正財', '七殺 正官', '偏印 正印'];
    const godSubs = ['(同我者)', '(我生者)', '(我剋者)', '(剋我者)', '(生我者)'];
    const godColors = order.map(e => {
        if (e === '木') return '#10b981';
        if (e === '火') return '#ef4444';
        if (e === '土') return '#d97706';
        if (e === '金') return '#cbd5e1';
        return '#3b82f6';
    });
    drawPentagon('tenGodsDiagram', '十神關係圖', godFullNames, godColors, godSubs);
}



function calculateXiYongShen(data) {
    const dm = data.pillars[2].s;
    const dmElem = getElement(dm);
    const monthZhi = data.pillars[1].b;
    const monthElem = getElement(monthZhi);
    
    // 1. 初始化計分與過程
    const weights = { stem: 1, branch: 2, month: 5 }; // 調高月令權重至 5
    const scores = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    const produceMap = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
    const controlMap = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
    const supportElem = produceMap[dmElem]; // 生我者
    
    let reasoning = [];
    
    // 2. 計算各柱得分並記錄過程
    reasoning.push(`<li><strong>日主元神：</strong> ${dm} (${dmElem}命)</li>`);
    
    data.pillars.forEach((p, i) => {
        const pillarName = ['年', '月', '日', '時'][i];
        // 天干計分 (跳過日主本人)
        if (i !== 2) {
            const sElem = getElement(p.s);
            scores[sElem] += weights.stem;
        }
        
        // 地支計分
        const bElem = getElement(p.b);
        const weight = (i === 1) ? weights.month : weights.branch;
        scores[bElem] += weight;
    });

    // 3. 三大指標判斷
    // A. 得令
    const isDeLing = (monthElem === dmElem || monthElem === supportElem);
    const deLingText = isDeLing ? 
        `<span class="success">【得令】</span> 生於 ${monthZhi}月 (${monthElem})，獲得月令旺氣支持。` : 
        `<span class="danger">【失令】</span> 生於 ${monthZhi}月 (${monthElem})，未得月令支持。`;
    reasoning.push(`<li><strong>1. 察月令 (得令)：</strong> ${deLingText}</li>`);

    // B. 得地
    const supportBranches = data.pillars.filter((p, i) => (getElement(p.b) === dmElem || getElement(p.b) === supportElem)).map(p => p.b);
    const isDeDi = supportBranches.length >= 2;
    reasoning.push(`<li><strong>2. 察地支 (得地)：</strong> 地支見 [${supportBranches.join('、')}]，共 ${supportBranches.length} 處強根支持。</li>`);

    // C. 得勢
    const supportStems = data.pillars.filter((p, i) => i !== 2 && (getElement(p.s) === dmElem || getElement(p.s) === supportElem)).map(p => p.s);
    const isDeShi = supportStems.length >= 2;
    reasoning.push(`<li><strong>3. 察天干 (得勢)：</strong> 天干見 [${supportStems.join('、')}]，有同類或印星透出幫扶。</li>`);

    // 4. 綜合能量結算
    const selfScore = scores[dmElem];
    const produceScore = scores[supportElem];
    const totalSupport = selfScore + produceScore;
    const totalEnergy = Object.values(scores).reduce((a, b) => a + b, 0);
    const strengthPercent = Math.round((totalSupport / totalEnergy) * 100);

    let strengthStatus = "";
    if (strengthPercent > 60) strengthStatus = "極強 (從旺可能)";
    else if (strengthPercent > 45) strengthStatus = "身強";
    else if (strengthPercent > 35) strengthStatus = "中和";
    else if (strengthPercent > 20) strengthStatus = "身弱";
    else strengthStatus = "極弱 (從勢可能)";

    reasoning.push(`<li><strong>4. 能量結算：</strong> 自體與印星總分 <strong>${totalSupport}</strong> / 總能量 <strong>${totalEnergy}</strong> (佔比 ${strengthPercent}%)。判定為 <strong>${strengthStatus}</strong>。</li>`);

    // 5. 喜用神選取邏輯
    let xiyong = [];
    let logicText = "";
    if (totalSupport >= totalEnergy * 0.42) {
        // 身強：宜 剋、洩、耗
        const options = ['木', '火', '土', '金', '水'].filter(e => e !== dmElem && e !== supportElem);
        // 排序：選分數最低（最缺）或最能平衡的
        const sorted = options.sort((a, b) => scores[a] - scores[b]);
        xiyong = [sorted[0], sorted[1]];
        logicText = `因身強氣旺，宜取「${xiyong.join('、')}」來疏導、平衡過盛的能量。`;
    } else {
        // 身弱：宜 補、生
        xiyong = [supportElem, dmElem];
        logicText = `因身弱氣虛，首選「${supportElem}」(印星) 生身，次選「${dmElem}」(比劫) 幫身。`;
    }

    // 6. 輸出
    let tiaoHouAdvice = "";
    if (['亥', '子', '丑'].includes(monthZhi)) tiaoHouAdvice = "❄️ 寒冬格局，需「火」調侯暖局。";
    else if (['巳', '午', '未'].includes(monthZhi)) tiaoHouAdvice = "🔥 盛夏格局，需「水」調侯潤局。";

    document.getElementById('xiYongShenContent').innerHTML = `
        <h4 class="sub-title">🔮 喜用神推演過程</h4>
        <ul style="list-style: none; padding: 0; font-size: 0.85rem; line-height: 1.8;">
            ${reasoning.join('')}
        </ul>
        <div class="remedy-box" style="margin-top: 1rem; border-left-color: var(--accent-blue);">
            <p style="color:var(--primary-gold); font-weight: 800;">建議喜用：${xiyong.join('、')}</p>
            <p style="font-size: 0.85rem; opacity: 0.9;">${logicText}</p>
            ${tiaoHouAdvice ? `<p style="font-size: 0.85rem; margin-top: 5px; color: var(--color-fire);">${tiaoHouAdvice}</p>` : ''}
        </div>
    `;
}

function generateAnalysis(data) {
    const content = document.getElementById('interpretationContent');
    const b = data.pillars.map(p => p.b), dm = data.pillars[2].s, allG = [];
    data.pillars.forEach(p => { if (p.sg!=='日主') allG.push(p.sg); if(p.bg) allG.push(p.bg); if(p.h) p.h.forEach(h=>allG.push(getTenGod(h,dm))); });
    let inters = [];
    for (let i=0; i<4; i++) { for (let j=i+1; j<4; j++) { const r = checkBranchRelation(b[i],b[j],['年','月','日','時'][i],['年','月','日','時'][j]); if(r) inters.push(...r); } }
    const missing = ['正財','偏財','正官','七殺','正印','偏印','食神','傷官','比肩','劫財'].filter(g => !allG.includes(g)), counts = {}; allG.forEach(g => counts[g] = (counts[g]||0)+1);
    const extremes = Object.keys(counts).filter(g => counts[g] >= 3);
    let html = `<div class="analysis-section"><h3 class="section-title">🌟 核心診斷</h3></div><div class="analysis-section"><h4 class="sub-title">地支動態</h4><div class="remedy-box">${inters.length>0 ? inters.map(it=>`<div style="margin-bottom:4px;"><span class="${it.type==='合'?'success':'danger'}">${it.tag}</span></div>`).join('') : '<p>平穩。</p>'}</div></div><div class="analysis-section"><h4 class="sub-title">缺失與極旺</h4><p>缺：${missing.slice(0,3).join('、')}。${extremes.length>0?extremes[0]+'過旺。':''}</p></div>`;
    data.pillars.forEach(p => { html += `<div class="analysis-section"><h4 class="sub-title">${['年','月','日','時'][data.pillars.indexOf(p)]}柱</h4><p><strong>天干 (${p.sg})：</strong>${XIANG_YI[p.sg]?.[p.id]||'穩定。'}</p><p><strong>地支 (${p.bg})：</strong>${XIANG_YI[p.bg]?.[p.id]||'環境。'}</p></div>`; });
    content.innerHTML = html;
}
async function copyDataForAI() {
    if (!currentBazi) { alert("請先生成命盤"); return; }
    
    const dm = currentBazi.getDay()[0];
    const call = (sfx) => {
        const h = `getHour${sfx}`, t = `getTime${sfx}`;
        return (typeof currentBazi[h] === 'function') ? currentBazi[h]() : (typeof currentBazi[t] === 'function' ? currentBazi[t]() : null);
    };

    const p = {
        y: currentBazi.getYear(),
        m: currentBazi.getMonth(),
        d: currentBazi.getDay(),
        h: call('') || ['', '']
    };

    let text = `【八字命盤參數 - AI解盤專用】\n`;
    text += `性別：${currentGender === 1 ? '男' : '女'}\n`;
    text += `日主元神：${dm}\n\n`;
    
    text += `--- 原局四柱 ---\n`;
    const pillarNames = ['年柱', '月柱', '日柱', '時柱'];
    const hiddens = [
        currentBazi.getYearHideGan(),
        currentBazi.getMonthHideGan(),
        currentBazi.getDayHideGan(),
        call('HideGan') || []
    ];

    [p.y, p.m, p.d, p.h].forEach((val, i) => {
        const sg = (i === 2) ? '日主' : getTenGod(val[0], dm);
        const bg = getTenGod(BRANCH_TO_STEM[val[1]], dm);
        const hideText = hiddens[i].map(h => `${h}:${getTenGod(h, dm)}`).join(', ');
        text += `${pillarNames[i]}：${val[0]}${val[1]} (天干十神：${sg} / 地支十神：${bg} / 藏干：[${hideText}])\n`;
    });

    if (window.currentSelectedLuck) {
        const { year, gan, zhi, dy } = window.currentSelectedLuck;
        const dyGZ = dy.getGanZhi();
        const dyS = getTenGod(dyGZ[0], dm);
        const dyB = getTenGod(BRANCH_TO_STEM[dyGZ[1]], dm);
        const dyH = (BRANCH_HIDE_GANS[dyGZ[1]] || []).map(h => `${h}:${getTenGod(h, dm)}`).join(', ');
        
        const lnS = getTenGod(gan, dm);
        const lnB = getTenGod(BRANCH_TO_STEM[zhi], dm);
        const lnH = (BRANCH_HIDE_GANS[zhi] || []).map(h => `${h}:${getTenGod(h, dm)}`).join(', ');
        
        // 獲取流月
        const activeMonthItem = document.querySelector('#liuyueList .luck-item.active');
        let lyText = "未選擇";
        if (activeMonthItem) {
            const spans = activeMonthItem.querySelectorAll('span');
            const mG = spans[0].innerText, mB = spans[1].innerText;
            const lyS = getTenGod(mG, dm), lyB = getTenGod(BRANCH_TO_STEM[mB], dm);
            const lyH = (BRANCH_HIDE_GANS[mB] || []).map(h => `${h}:${getTenGod(h, dm)}`).join(', ');
            lyText = `${mG}${mB} (天干：${lyS} / 地支：${lyB} / 藏干：[${lyH}])`;
        }

        text += `\n--- 當前運勢 (歲運) ---\n`;
        text += `大運：${dyGZ[0]}${dyGZ[1]} (天干：${dyS} / 地支：${dyB} / 藏干：[${dyH}])\n`;
        text += `流年：${gan}${zhi} (${year}年) (天干：${lnS} / 地支：${lnB} / 藏干：[${lnH}])\n`;
        
        // 獲取該流年的全部 12 個月
        const ln = dy.getLiuNian().find(l => l.getYear() === year);
        if (ln) {
            text += `\n--- 當年 12 流月詳情 ---\n`;
            const branchNames = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
            const lyList = ln.getLiuYue();
            lyList.forEach(ly => {
                const lGZ = ly.getGanZhi();
                const lS = getTenGod(lGZ[0], dm);
                const lB = getTenGod(BRANCH_TO_STEM[lGZ[1]], dm);
                const lH = (BRANCH_HIDE_GANS[lGZ[1]] || []).map(h => `${h}:${getTenGod(h, dm)}`).join(', ');
                const idx = ly.getIndex();
                text += `${branchNames[idx]}月：${lGZ[0]}${lGZ[1]} (天干：${lS} / 地支：${lB} / 藏干：[${lH}])\n`;
            });
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('copyAIBtn');
        const oldText = btn.innerText;
        btn.innerText = "✅ 已複製到剪貼簿";
        btn.style.borderColor = "var(--color-wood)";
        setTimeout(() => { 
            btn.innerText = oldText; 
            btn.style.borderColor = "var(--primary-gold)";
        }, 2000);
    } catch (err) {
        alert("複製失敗，請手動選取文字");
        console.error(err);
    }
}
