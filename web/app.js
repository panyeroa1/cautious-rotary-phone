const apiBase = location.origin; // same host/port (3456)
const el = (s) => document.querySelector(s);
const els = (s) => document.querySelectorAll(s);

async function fetchJSON(url, opts={}) {
  const r = await fetch(url, {headers:{'Content-Type':'application/json'}, ...opts});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

function currentAgentFromUI(){
  const cfg = safeParse(el('#agent-config').value.trim() || '{}');
  return {
    id: null,
    name: el('#agent-name').value.trim() || 'Untitled Agent',
    description: el('#agent-desc').value.trim() || '',
    stt_provider: el('#stt-provider').value,
    stt_model: el('#stt-model').value,
    llm_provider: el('#llm-provider').value,
    llm_model: el('#llm-model').value,
    tts_provider: el('#tts-provider').value,
    tts_voice: el('#tts-voice').value,
    vad: { enabled: el('#vad-enabled').value === 'true', mode: Number(el('#vad-mode').value || 2) },
    enhancer: { enabled: el('#enhancer-enabled').value === 'true' },
    config: cfg
  };
}

function safeParse(s){ try { return JSON.parse(s); } catch(e){ return {}; } }

function saveLocal(){
  const agent = currentAgentFromUI();
  localStorage.setItem('eburon_agent', JSON.stringify(agent));
  alert('Saved to LocalStorage');
}

function loadLocal(){
  const raw = localStorage.getItem('eburon_agent');
  if(!raw){ alert('No local agent found'); return; }
  const a = JSON.parse(raw);
  el('#agent-name').value = a.name || '';
  el('#agent-desc').value = a.description || '';
  el('#stt-provider').value = a.stt_provider || 'deepgram';
  el('#llm-provider').value = a.llm_provider || 'ollama_cloud';
  el('#tts-provider').value = a.tts_provider || 'gemini';
  // trigger dependent fills
  populateModels(a);
  el('#agent-config').value = JSON.stringify(a.config || {}, null, 2);
  el('#vad-enabled').value = String(a?.vad?.enabled ?? true);
  el('#vad-mode').value = String(a?.vad?.mode ?? 2);
  el('#enhancer-enabled').value = String(a?.enhancer?.enabled ?? true);
}

function populateModels(defaults={}){
  // STT models
  const sttProvider = el('#stt-provider').value;
  const sttModels = window.__providers.stt.find(p=>p.id===sttProvider)?.models || [];
  fillSelect(el('#stt-model'), sttModels, defaults.stt_model || sttModels[0]);

  // LLM models
  const llmProvider = el('#llm-provider').value;
  const llmModels = window.__providers.llm.find(p=>p.id===llmProvider)?.models || [];
  fillSelect(el('#llm-model'), llmModels, defaults.llm_model || llmModels[0]);

  // TTS voices
  const ttsProvider = el('#tts-provider').value;
  const ttsVoices = window.__providers.tts.find(p=>p.id===ttsProvider)?.voices || [];
  fillSelect(el('#tts-voice'), ttsVoices, defaults.tts_voice || ttsVoices[0]);
}

function fillSelect(selectEl, items, selected){
  selectEl.innerHTML = '';
  for(const v of items){
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v;
    if(v===selected) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

async function init(){
  // providers
  window.__providers = await fetchJSON(`${apiBase}/api/providers`);
  // fill provider selects
  const sttProv = window.__providers.stt.map(x=>x.id);
  const llmProv = window.__providers.llm.map(x=>x.id);
  const ttsProv = window.__providers.tts.map(x=>x.id);

  fillSelect(el('#stt-provider'), sttProv, 'deepgram');
  fillSelect(el('#llm-provider'), llmProv, 'ollama_cloud');
  fillSelect(el('#tts-provider'), ttsProv, 'gemini');

  // when provider changes, update models/voices
  el('#stt-provider').addEventListener('change', ()=>populateModels({}));
  el('#llm-provider').addEventListener('change', ()=>populateModels({}));
  el('#tts-provider').addEventListener('change', ()=>populateModels({}));

  populateModels({});
  // wires
  el('#btn-save-local').addEventListener('click', saveLocal);
  el('#btn-load-local').addEventListener('click', loadLocal);
  el('#btn-create-api').addEventListener('click', createViaAPI);
  el('#btn-list-api').addEventListener('click', listViaAPI);
}

async function createViaAPI(){
  const agent = currentAgentFromUI();
  const res = await fetchJSON(`${apiBase}/api/agents`, { method:'POST', body: JSON.stringify(agent) });
  await listViaAPI();
  alert(`Created agent: ${res.id}`);
}

async function listViaAPI(){
  const arr = await fetchJSON(`${apiBase}/api/agents`);
  const host = el('#agents-list');
  host.innerHTML = '';
  for(const a of arr){
    const row = document.createElement('div');
    row.className='row';
    row.innerHTML = `
      <div><strong>${a.name}</strong><div class="badge">${a.id}</div></div>
      <div>${a.description||''}</div>
      <button data-id="${a.id}" class="btn-edit">Edit</button>
      <button data-id="${a.id}" class="btn-del">Delete</button>
      <button data-id="${a.id}" class="btn-publish">Publish</button>
    `;
    host.appendChild(row);
  }
  host.querySelectorAll('.btn-edit').forEach(b=>{
    b.onclick = async ()=>{
      const id=b.dataset.id;
      const item = await fetchJSON(`${apiBase}/api/agents/${id}`);
      // Load into UI
      el('#agent-name').value = item.name || '';
      el('#agent-desc').value = item.description || '';
      el('#stt-provider').value = item.stt_provider || 'deepgram';
      el('#llm-provider').value = item.llm_provider || 'ollama_cloud';
      el('#tts-provider').value = item.tts_provider || 'gemini';
      populateModels(item);
      el('#agent-config').value = JSON.stringify(item.config || {}, null, 2);
      el('#vad-enabled').value = String(item?.vad?.enabled ?? true);
      el('#vad-mode').value = String(item?.vad?.mode ?? 2);
      el('#enhancer-enabled').value = String(item?.enhancer?.enabled ?? true);

      // offer update
      const yes = confirm('Update this agent with current UI values?');
      if(yes){
        const updated = currentAgentFromUI();
        const res = await fetchJSON(`${apiBase}/api/agents/${id}`, { method:'PUT', body: JSON.stringify(updated) });
        alert('Updated: '+res.id);
        await listViaAPI();
      }
    };
  });
  host.querySelectorAll('.btn-del').forEach(b=>{
    b.onclick = async ()=>{
      const id=b.dataset.id;
      if(confirm('Delete this agent?')){
        await fetchJSON(`${apiBase}/api/agents/${id}`, { method:'DELETE' });
        await listViaAPI();
      }
    };
  });
  host.querySelectorAll('.btn-publish').forEach(b => {
    b.onclick = async () => {
      const agentId = b.dataset.id;
      const phoneNumber = prompt(
        'Enter Twilio phone number to publish to (E.164 format, e.g., +15551234567):',
        ''
      );

      if (!phoneNumber || !phoneNumber.trim()) {
        alert('Publish cancelled.');
        return;
      }

      if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        alert('Invalid phone number format. Please use E.164 format (e.g., +15551234567).');
        return;
      }

      try {
        const body = { phone_number: phoneNumber, agent_id: agentId };
        const res = await fetchJSON(`${apiBase}/api/publish`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        alert(res.message || 'Successfully published!');
      } catch (err) {
        console.error('Publish failed:', err);
        alert('Failed to publish: ' + err.message);
      }
    };
  });
}

init().catch(err=>{
  console.error(err);
  alert('Failed to initialize UI: '+err.message);
});
