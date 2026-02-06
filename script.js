// ======================================
// STEM Lab - Дастурлi Энергия - script.js
// ======================================

let completedTasks = 0;
const totalTasks = 7;

function updateProgress() {
  const el = document.getElementById("progress-count");
  if (el) el.textContent = completedTasks + " / " + totalTasks;
}

function markTaskDone(taskEl) {
  if (!taskEl.classList.contains("completed")) {
    taskEl.classList.add("completed");
    completedTasks++;
    updateProgress();
  }
}

function showResult(id, type, text) {
  const el = document.getElementById(id);
  el.className = "result show " + type;
  el.textContent = text;
}

// ============================================================
// TASK 1 - Match energy sources
// ============================================================
(function () {
  const pairs = [
    { source: "Komir", sourceLabel: "Komip", target: "coal-desc", desc: "Zher astyndan qazyp alynatyn qatty otyn" },
    { source: "Munai", sourceLabel: "Munai", target: "oil-desc", desc: "Suzgishten otip benzin men dizel alynatyn suiyq otyn" },
    { source: "Gas", sourceLabel: "Tabigi gaz", target: "gas-desc", desc: "Turmagy zhylytu men elektr stansalarynda qoldanylatyn gaz turindegi otyn" },
    { source: "Yadro", sourceLabel: "Yadroliq energiya", target: "nuclear-desc", desc: "Atom yadrosynyn bolinuinen alynatyn kush" },
  ];

  let selectedSource = null;
  let matchedCount = 0;

  window.matchSelect = function (side, key, el) {
    if (el.classList.contains("correct") || el.classList.contains("disabled")) return;

    if (side === "left") {
      document.querySelectorAll("#match-left .match-item").forEach((i) => i.classList.remove("selected"));
      el.classList.add("selected");
      selectedSource = key;
    } else if (side === "right" && selectedSource) {
      const pair = pairs.find((p) => p.source === selectedSource);
      if (pair && pair.target === key) {
        el.classList.add("correct");
        document.querySelector('#match-left .match-item.selected').classList.add("correct", "disabled");
        matchedCount++;
        if (matchedCount === pairs.length) {
          showResult("match-result", "success", "Tамаша! Барлық энергия көздерін дұрыс сәйкестендірдіңіз!");
          markTaskDone(document.getElementById("task-match"));
        }
      } else {
        el.classList.add("wrong");
        setTimeout(() => el.classList.remove("wrong"), 600);
      }
      document.querySelectorAll("#match-left .match-item").forEach((i) => {
        if (!i.classList.contains("correct")) i.classList.remove("selected");
      });
      selectedSource = null;
    }
  };
})();

// ============================================================
// TASK 2 - Circuit Builder
// ============================================================
(function () {
  const correctOrder = ["battery", "wire1", "resistor", "led", "wire2", "gnd"];
  const labels = {
    battery: "5V (Қорек)",
    wire1: "Сым (қызыл)",
    resistor: "Резистор 220Ω",
    led: "LED (жарық диод)",
    wire2: "Сым (қара)",
    gnd: "GND (жер)",
  };
  let slots = [];

  window.circuitAdd = function (key, el) {
    if (el.classList.contains("in-slot")) return;
    if (slots.length >= correctOrder.length) return;
    slots.push(key);
    el.classList.add("in-slot");
    renderCircuitSlots();
  };

  window.circuitRemove = function (index) {
    const key = slots[index];
    slots.splice(index, 1);
    const chips = document.querySelectorAll("#circuit-bank .circuit-chip");
    chips.forEach((c) => {
      if (c.dataset.key === key) c.classList.remove("in-slot");
    });
    renderCircuitSlots();
  };

  function renderCircuitSlots() {
    const container = document.getElementById("circuit-slots");
    if (slots.length === 0) {
      container.innerHTML = '<span style="color:var(--text-dim);font-size:13px;">Компоненттерді ретімен басыңыз...</span>';
      return;
    }
    let html = "";
    slots.forEach((key, i) => {
      html += '<span class="circuit-chip in-slot" onclick="circuitRemove(' + i + ')" title="Алып тастау">' + labels[key] + "</span>";
      if (i < slots.length - 1) html += '<span class="circuit-arrow">→</span>';
    });
    container.innerHTML = html;
  }

  window.circuitCheck = function () {
    if (slots.length !== correctOrder.length) {
      showResult("circuit-result", "error", "Барлық " + correctOrder.length + " компонентті орналастырыңыз!");
      return;
    }
    const isCorrect = slots.every((s, i) => s === correctOrder[i]);
    if (isCorrect) {
      showResult("circuit-result", "success", "Керемет! LED тізбегін дұрыс құрастырдыңыз! Тинкеркадта дәл осылай жасалады.");
      markTaskDone(document.getElementById("task-circuit"));
    } else {
      showResult("circuit-result", "error", "Тізбек дұрыс емес. Ток көзінен бастап, GND-ге дейін ретін тексеріңіз.");
    }
  };

  window.circuitReset = function () {
    slots = [];
    document.querySelectorAll("#circuit-bank .circuit-chip").forEach((c) => c.classList.remove("in-slot"));
    renderCircuitSlots();
    document.getElementById("circuit-result").className = "result";
  };
})();

// ============================================================
// TASK 3 - Power plant process ordering (drag-and-drop)
// ============================================================
(function () {
  const correctOrder = ["fuel", "boiler", "turbine", "generator", "transformer"];
  let items = [
    { id: "boiler", label: "Қазандық", desc: "Суды буға айналдырады" },
    { id: "transformer", label: "Трансформатор", desc: "Кернеуді арттырып таратады" },
    { id: "fuel", label: "Отын жағу", desc: "Көмір/газ жанады" },
    { id: "generator", label: "Генератор", desc: "Электр тоғын шығарады" },
    { id: "turbine", label: "Турбина", desc: "Бу турбинаны айналдырады" },
  ];

  let dragIdx = null;

  window.ppDragStart = function (idx) {
    dragIdx = idx;
  };

  window.ppDragOver = function (e, idx) {
    e.preventDefault();
    document.querySelectorAll(".process-item").forEach((el, i) => {
      el.classList.toggle("drag-over", i === idx);
    });
  };

  window.ppDrop = function (e, idx) {
    e.preventDefault();
    document.querySelectorAll(".process-item").forEach((el) => el.classList.remove("drag-over"));
    if (dragIdx === null || dragIdx === idx) return;
    const temp = items[dragIdx];
    items.splice(dragIdx, 1);
    items.splice(idx, 0, temp);
    renderPP();
  };

  window.ppCheck = function () {
    const isCorrect = items.every((item, i) => item.id === correctOrder[i]);
    if (isCorrect) {
      showResult("pp-result", "success", "Дұрыс! Жылу электр станциясының жұмыс тәртібін білесіз!");
      markTaskDone(document.getElementById("task-pp"));
    } else {
      showResult("pp-result", "error", "Қате тәртіп. Отын жағудан бастап, трансформаторға дейін ойланыңыз.");
    }
  };

  function renderPP() {
    const container = document.getElementById("pp-items");
    let html = "";
    items.forEach((item, i) => {
      html +=
        '<div class="process-item" draggable="true" ondragstart="ppDragStart(' +
        i +
        ')" ondragover="ppDragOver(event,' +
        i +
        ')" ondrop="ppDrop(event,' +
        i +
        ')">' +
        '<span class="num">' +
        (i + 1) +
        "</span>" +
        '<span class="label">' +
        item.label +
        "</span>" +
        '<span class="desc">' +
        item.desc +
        "</span>" +
        "</div>";
    });
    container.innerHTML = html;
  }

  // Initial render
  document.addEventListener("DOMContentLoaded", renderPP);
})();

// ============================================================
// TASK 4 - Sort energy types
// ============================================================
(function () {
  const items = [
    { name: "Көмір", icon: "pickaxe", type: "traditional" },
    { name: "Күн энергиясы", icon: "sun", type: "renewable" },
    { name: "Табиғи газ", icon: "flame", type: "traditional" },
    { name: "Жел энергиясы", icon: "wind", type: "renewable" },
    { name: "Мұнай", icon: "droplet", type: "traditional" },
    { name: "Су энергиясы", icon: "wave", type: "renewable" },
    { name: "Ядролық энергия", icon: "atom", type: "traditional" },
    { name: "Биомасса", icon: "leaf", type: "renewable" },
    { name: "Торф", icon: "layers", type: "traditional" },
    { name: "Геотермалды", icon: "thermometer", type: "renewable" },
  ];

  let currentIdx = 0;
  let correctCount = 0;
  let results = [];

  function renderSort() {
    const dotsEl = document.getElementById("sort-dots");
    let dotsHtml = "";
    items.forEach((_, i) => {
      let cls = "sort-dot";
      if (i < currentIdx) cls += results[i] ? " done" : " wrong-dot";
      else if (i === currentIdx) cls += " active";
      dotsHtml += '<div class="' + cls + '"></div>';
    });
    dotsEl.innerHTML = dotsHtml;

    const curEl = document.getElementById("sort-current");
    if (currentIdx < items.length) {
      const icons = {
        pickaxe: "&#9874;", sun: "&#9788;", flame: "&#128293;", wind: "&#127744;",
        droplet: "&#128167;", wave: "&#127754;", atom: "&#9883;", leaf: "&#127807;",
        layers: "&#9776;", thermometer: "&#127777;"
      };
      curEl.innerHTML =
        '<div class="sort-current-icon">' + (icons[items[currentIdx].icon] || "?") + "</div>" +
        '<div class="sort-current-label">' + (currentIdx + 1) + " / " + items.length + "</div>" +
        '<div class="sort-current-item">' + items[currentIdx].name + "</div>";
      document.getElementById("sort-btns").style.display = "grid";
    } else {
      document.getElementById("sort-btns").style.display = "none";
      const pct = Math.round((correctCount / items.length) * 100);
      if (pct >= 80) {
        showResult("sort-result", "success", "Тамаша! " + correctCount + "/" + items.length + " дұрыс (" + pct + "%)");
        markTaskDone(document.getElementById("task-sort"));
      } else {
        showResult("sort-result", "partial", correctCount + "/" + items.length + " дұрыс (" + pct + "%). 80% жинау керек. Қайта байқап көріңіз!");
      }
    }
  }

  window.sortAnswer = function (answer) {
    if (currentIdx >= items.length) return;
    const correct = items[currentIdx].type === answer;
    results.push(correct);
    if (correct) correctCount++;

    // Flash effect
    const btn = document.querySelector('.sort-btn.' + answer);
    btn.classList.add(correct ? "correct-flash" : "wrong-flash");
    setTimeout(() => btn.classList.remove("correct-flash", "wrong-flash"), 300);

    currentIdx++;
    setTimeout(renderSort, 350);
  };

  window.sortReset = function () {
    currentIdx = 0;
    correctCount = 0;
    results = [];
    document.getElementById("sort-result").className = "result";
    document.getElementById("task-sort").classList.remove("completed");
    renderSort();
  };

  document.addEventListener("DOMContentLoaded", renderSort);
})();

// ============================================================
// TASK 5 - Energy calculator
// ============================================================
(function () {
  const fuels = {
    coal: { name: "Көмір", calorific: 29.3, co2: 2.42 },
    oil: { name: "Мұнай", calorific: 41.9, co2: 3.07 },
    gas: { name: "Табиғи газ", calorific: 33.5, co2: 1.89 },
    uranium: { name: "Уран", calorific: 79500000, co2: 0 },
  };

  window.calcEnergy = function () {
    const fuelKey = document.getElementById("calc-fuel").value;
    const amount = parseFloat(document.getElementById("calc-amount").value);
    const eff = parseInt(document.getElementById("calc-eff").value) / 100;

    if (!fuelKey || isNaN(amount) || amount <= 0) {
      showResult("calc-result", "error", "Барлық мәндерді дұрыс толтырыңыз!");
      return;
    }

    const fuel = fuels[fuelKey];
    const totalMJ = amount * fuel.calorific;
    const electricMJ = totalMJ * eff;
    const kWh = electricMJ / 3.6;
    const co2 = amount * fuel.co2;

    document.getElementById("calc-total").textContent = totalMJ >= 1000000 ? (totalMJ / 1000000).toFixed(2) + "M" : totalMJ.toFixed(1);
    document.getElementById("calc-kwh").textContent = kWh >= 1000000 ? (kWh / 1000000).toFixed(2) + "M" : kWh.toFixed(1);
    document.getElementById("calc-co2").textContent = co2.toFixed(1);

    document.getElementById("calc-results").classList.add("show");
    showResult("calc-result", "success", "Есептеу дұрыс орындалды!");
    markTaskDone(document.getElementById("task-calc"));
  };

  window.updateEff = function (val) {
    document.getElementById("eff-val").textContent = val + "%";
  };
})();

// ============================================================
// TASK 6 - Code Debug (Arduino)
// ============================================================
(function () {
  const challenges = [
    {
      title: "LED жыпылықтау кодында қате тап",
      code:
        '<span class="code-comment">// LED жыпылықтау бағдарламасы</span>\n' +
        '<span class="code-keyword">int</span> ledPin = <span class="code-number">13</span>;\n\n' +
        '<span class="code-keyword">void</span> <span class="code-func">setup</span>() {\n' +
        '  <span class="code-func">pinMod</span>(ledPin, <span class="code-string">OUTPUT</span>);\n' +
        "}\n\n" +
        '<span class="code-keyword">void</span> <span class="code-func">loop</span>() {\n' +
        '  <span class="code-func">digitalWrite</span>(ledPin, <span class="code-string">HIGH</span>);\n' +
        '  <span class="code-func">delay</span>(<span class="code-number">1000</span>);\n' +
        '  <span class="code-func">digitalWrite</span>(ledPin, <span class="code-string">LOW</span>);\n' +
        '  <span class="code-func">delay</span>(<span class="code-number">1000</span>);\n' +
        "}",
      options: [
        { text: 'pinMod → pinMode деп жазу керек', correct: true },
        { text: 'delay(1000) → delay(100) болу керек', correct: false },
        { text: 'ledPin = 13 → ledPin = 12 болу керек', correct: false },
      ],
      explanation: 'Arduino-да пин режимін орнату функциясы "pinMode" деп жазылады, "pinMod" емес. Бұл жиі кездесетін синтаксистік қате.',
    },
    {
      title: "Температура сенсоры кодындағы қатені табыңыз",
      code:
        '<span class="code-keyword">int</span> sensorPin = <span class="code-string">A0</span>;\n' +
        '<span class="code-keyword">float</span> temperature;\n\n' +
        '<span class="code-keyword">void</span> <span class="code-func">setup</span>() {\n' +
        '  <span class="code-func">Serial</span>.<span class="code-func">begin</span>(<span class="code-number">9600</span>);\n' +
        "}\n\n" +
        '<span class="code-keyword">void</span> <span class="code-func">loop</span>() {\n' +
        '  <span class="code-keyword">int</span> value = <span class="code-func">analogRead</span>(sensorPin);\n' +
        '  temperature = value * <span class="code-number">5.0</span> / <span class="code-number">1024</span>;\n' +
        '  <span class="code-func">Serial</span>.<span class="code-func">println</span>(tempereture);\n' +
        '  <span class="code-func">delay</span>(<span class="code-number">500</span>);\n' +
        "}",
      options: [
        { text: "Serial.begin(9600) қате, 115200 болу керек", correct: false },
        { text: "tempereture → temperature деп жазу керек (емле қатесі)", correct: true },
        { text: "analogRead орнына digitalRead қолдану керек", correct: false },
      ],
      explanation: '"tempereture" деп жазылған, ал дұрысы "temperature". Айнымалы атының емле қатесі компиляция кезінде қате береді.',
    },
  ];

  let currentChallenge = 0;
  let codeScore = 0;

  function renderCode() {
    const ch = challenges[currentChallenge];
    document.getElementById("code-title").textContent = ch.title;
    document.getElementById("code-display").innerHTML = ch.code;

    const optEl = document.getElementById("code-options");
    let html = "";
    ch.options.forEach((opt, i) => {
      html += '<button class="code-option" onclick="codeAnswer(' + i + ')" data-idx="' + i + '">' + opt.text + "</button>";
    });
    optEl.innerHTML = html;
    document.getElementById("code-explanation").className = "quiz-explanation";
    document.getElementById("code-explanation").textContent = "";
    document.getElementById("code-next-btn").style.display = "none";
  }

  window.codeAnswer = function (idx) {
    const ch = challenges[currentChallenge];
    const btns = document.querySelectorAll("#code-options .code-option");
    btns.forEach((b) => b.classList.add("disabled"));

    if (ch.options[idx].correct) {
      btns[idx].classList.add("correct");
      codeScore++;
    } else {
      btns[idx].classList.add("wrong");
      ch.options.forEach((opt, i) => {
        if (opt.correct) btns[i].classList.add("correct");
      });
    }

    const expEl = document.getElementById("code-explanation");
    expEl.textContent = ch.explanation;
    expEl.classList.add("show");

    if (currentChallenge < challenges.length - 1) {
      document.getElementById("code-next-btn").style.display = "inline-flex";
    } else {
      if (codeScore === challenges.length) {
        showResult("code-result", "success", "Тамаша! Барлық қателерді таптыңыз! (" + codeScore + "/" + challenges.length + ")");
        markTaskDone(document.getElementById("task-code"));
      } else {
        showResult("code-result", "partial", codeScore + "/" + challenges.length + " дұрыс. Қайтадан байқап көріңіз!");
      }
    }
  };

  window.codeNext = function () {
    currentChallenge++;
    renderCode();
  };

  document.addEventListener("DOMContentLoaded", renderCode);
})();

// ============================================================
// TASK 7 - Final Quiz
// ============================================================
(function () {
  const questions = [
    {
      q: "Қазақстанда электр энергиясының ең көп бөлігі қандай отыннан алынады?",
      opts: ["Табиғи газ", "Көмір", "Мұнай", "Уран"],
      correct: 1,
      explain: "Қазақстанда электр энергиясының ~70%-ы көмір жағу арқылы алынады. Екібастұз, Қарағанды көмір кен орындары негізгі көздер.",
    },
    {
      q: "Ом заңының формуласы қандай?",
      opts: ["P = U * I", "U = I * R", "E = mc^2", "W = P * t"],
      correct: 1,
      explain: "Ом заңы: U = I * R, мұндағы U - кернеу (Вольт), I - ток күші (Ампер), R - кедергі (Ом).",
    },
    {
      q: "Arduino Uno платасында неше цифрлық пин бар?",
      opts: ["8", "10", "14", "20"],
      correct: 2,
      explain: "Arduino Uno-да 14 цифрлық пин бар (D0-D13), оның ішінде 6-уы PWM шығысын қолдайды.",
    },
    {
      q: "Жылу электр станциясында (ЖЭС) энергия қандай тәртіппен өндіріледі?",
      opts: [
        "Отын → Турбина → Қазан → Генератор",
        "Отын → Қазан → Турбина → Генератор",
        "Қазан → Отын → Генератор → Турбина",
        "Генератор → Турбина → Қазан → Отын",
      ],
      correct: 1,
      explain: "ЖЭС-те: Отын жағылады → Қазанда су бу болады → Бу турбинаны айналдырады → Генератор ток шығарады.",
    },
    {
      q: "Tinkercad-та Arduino тізбегін симуляциялау үшін қандай режимді қолданамыз?",
      opts: ["3D Design", "Codeblocks", "Circuits", "Sim Lab"],
      correct: 2,
      explain: "Tinkercad Circuits режимінде Arduino тізбектерін виртуалды түрде құрастырып, код жазып, симуляция жүргізуге болады.",
    },
    {
      q: "1 киловатт-сағат (кВт*с) қанша Джоульге тең?",
      opts: ["1000 Дж", "36 000 Дж", "360 000 Дж", "3 600 000 Дж"],
      correct: 3,
      explain: "1 кВт*с = 1000 Вт * 3600 с = 3 600 000 Дж = 3.6 МДж.",
    },
    {
      q: "Көмірді жағу кезінде қоршаған ортаға ең көп зиян тигізетін газ қандай?",
      opts: ["Оттегі (O2)", "Азот (N2)", "Көмірқышқыл газы (CO2)", "Сутегі (H2)"],
      correct: 2,
      explain: "Көмір жанғанда CO2 (көмірқышқыл газы) көп бөлінеді, ол жылыжай эффектісін күшейтіп, климат өзгерісіне алып келеді.",
    },
    {
      q: "Arduino-да analogRead() функциясы қандай мән қайтарады?",
      opts: ["0 немесе 1", "0-дан 255-ке дейін", "0-дан 1023-ке дейін", "0-дан 4095-ке дейін"],
      correct: 2,
      explain: "Arduino Uno-дағы 10-биттік ADC (аналогты-цифрлық түрлендіргіш) 0-дан 1023-ке дейін мән қайтарады.",
    },
  ];

  let qIdx = 0;
  let score = 0;
  let answered = false;

  function renderQuiz() {
    if (qIdx >= questions.length) {
      document.getElementById("quiz-body").style.display = "none";
      const final = document.getElementById("quiz-final");
      final.classList.add("show");
      const pct = Math.round((score / questions.length) * 100);
      let color = pct >= 75 ? "var(--green)" : pct >= 50 ? "var(--orange)" : "var(--red)";
      final.innerHTML =
        '<div class="score" style="color:' + color + '">' + score + " / " + questions.length + "</div>" +
        '<div class="label">' + pct + '% - ' + (pct >= 75 ? "Тамаша нәтиже!" : pct >= 50 ? "Жаман емес!" : "Қайталап көріңіз!") + "</div>";
      if (pct >= 62) {
        markTaskDone(document.getElementById("task-quiz"));
      }
      return;
    }

    const q = questions[qIdx];
    answered = false;
    document.getElementById("quiz-progress-fill").style.width = ((qIdx / questions.length) * 100) + "%";
    document.getElementById("quiz-qnum").textContent = "Сұрақ " + (qIdx + 1) + " / " + questions.length;
    document.getElementById("quiz-qtext").textContent = q.q;

    const optsEl = document.getElementById("quiz-opts");
    let html = "";
    q.opts.forEach((opt, i) => {
      html += '<button class="quiz-option" onclick="quizAnswer(' + i + ')">' + opt + "</button>";
    });
    optsEl.innerHTML = html;
    document.getElementById("quiz-explain").className = "quiz-explanation";
    document.getElementById("quiz-next-btn").style.display = "none";
  }

  window.quizAnswer = function (idx) {
    if (answered) return;
    answered = true;
    const q = questions[qIdx];
    const btns = document.querySelectorAll("#quiz-opts .quiz-option");
    btns.forEach((b) => b.classList.add("disabled"));

    if (idx === q.correct) {
      btns[idx].classList.add("correct");
      score++;
    } else {
      btns[idx].classList.add("wrong");
      btns[q.correct].classList.add("correct");
    }

    const expEl = document.getElementById("quiz-explain");
    expEl.textContent = q.explain;
    expEl.classList.add("show");

    document.getElementById("quiz-next-btn").style.display = "inline-flex";
  };

  window.quizNext = function () {
    qIdx++;
    renderQuiz();
  };

  document.addEventListener("DOMContentLoaded", renderQuiz);
})();
