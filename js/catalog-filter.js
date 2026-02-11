// catalog-filter.js
// 前提：各車両カードに data-make / data-model 属性が付与されていること
// 例：<article class="vehicle-card" data-make="Toyota" data-model="Corolla">...</article>

document.addEventListener('DOMContentLoaded', () => {
  const makeSelect = document.querySelector('#make-filter');
  const modelSelect = document.querySelector('#model-filter');

  if (!makeSelect || !modelSelect) return;

  let makeModelMap = {};

  // vehicles.json から Make → Model の対応表を作成
  fetch('./vehicles.json')
    .then((res) => res.json())
    .then((vehicles) => {
      makeModelMap = buildMakeModelMap(vehicles);
      // 初期状態では Model セレクトは「All Models」のみ
      resetModelOptions();
      // すでに Make が選択されている場合は候補を生成
      if (makeSelect.value) {
        populateModelOptions(makeSelect.value);
      }
      // 初回フィルタ実行
      filterVehicles();
    })
    .catch((err) => {
      console.error('Failed to load vehicles.json:', err);
    });

  function buildMakeModelMap(vehicles) {
    const map = {};
    vehicles.forEach((v) => {
      const make = (v.make || '').trim();
      const model = (v.model || '').trim();
      if (!make || !model) return;
      if (!map[make]) map[make] = new Set();
      map[make].add(model);
    });
    return map;
  }

  function resetModelOptions() {
    modelSelect.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = '';
    allOpt.textContent = 'All Models';
    modelSelect.appendChild(allOpt);
  }

  function populateModelOptions(selectedMake) {
    resetModelOptions();
    const modelsSet = makeModelMap[selectedMake];
    if (!modelsSet) return;
    const models = Array.from(modelsSet).sort((a, b) => a.localeCompare(b));
    models.forEach((model) => {
      const opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  }

  function filterVehicles() {
    const selectedMake = makeSelect.value.trim();
    const selectedModel = modelSelect.value.trim();
    const cards = document.querySelectorAll('.vehicle-card');

    cards.forEach((card) => {
      const cardMake = (card.dataset.make || '').trim();
      const cardModel = (card.dataset.model || '').trim();

      const matchMake = !selectedMake || cardMake === selectedMake;
      const matchModel = !selectedModel || cardModel === selectedModel;

      if (matchMake && matchModel) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Make 選択時：Model 候補を更新 + フィルタ
  makeSelect.addEventListener('change', () => {
    const selectedMake = makeSelect.value.trim();
    if (selectedMake) {
      populateModelOptions(selectedMake);
    } else {
      resetModelOptions();
    }
    filterVehicles();
  });

  // Model 選択時：フィルタのみ
  modelSelect.addEventListener('change', () => {
    filterVehicles();
  });
});

