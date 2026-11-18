/**
 * LocalResearchAgent (V8.32.47)
 * 
 * Minimal constrained agent:
 * - Isolated from shell, filesystem, external networks, DB credentials.
 * - Receives an authorized task payload from V3 Dispatcher.
 * - Formulates prompt and calls the local Gateway exclusively.
 * - Cannot authorize its own tasks, bypass the Gateway, or mutate missions DB directly.
 */

import axios from 'axios';

export class LocalResearchAgent {
    constructor(options = {}) {
        this.gatewayUrl = options.gatewayUrl || 'http://127.0.0.1:4000';
        this.internalPsk = options.internalPsk || process.env.INTERNAL_SERVICE_PSK;
        this.agentId = 'agent-local-research-01';
        this.model = options.model || 'local-model';
    }

    /**
     * Execute an authorized research task through the Gateway.
     * @param {Object} authorizedTask
     * @param {string} authorizedTask.execution_attempt_id
     * @param {string} authorizedTask.mission_id
     * @param {string} authorizedTask.prompt
     * @param {Object} [authorizedTask.parameters]
     */
    async executeTask(authorizedTask) {
        if (!authorizedTask || typeof authorizedTask !== 'object') {
            throw new Error('LocalResearchAgent: Invalid task payload (must be object)');
        }

        const { execution_attempt_id, mission_id, prompt } = authorizedTask;

        if (!execution_attempt_id || !mission_id || !prompt) {
            throw new Error('LocalResearchAgent: Missing mandatory task fields (execution_attempt_id, mission_id, prompt)');
        }

        if (!this.internalPsk) {
            throw new Error('LocalResearchAgent: Missing internal PSK credentials');
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-internal-service-token': this.internalPsk,
            'x-request-id': execution_attempt_id
        };

        const body = {
            request_id: execution_attempt_id,
            model: this.model,
            prompt: prompt,
            system_prompt: 'Eres un agente de investigacion local supervisado por Antigravity V3. Responde de manera concisa y exacta.',
            temperature: 0,
            max_tokens: 150
        };

        const response = await axios.post(
            this.gatewayUrl + '/v1/inference',
            body,
            { headers, timeout: 60000 }
        );

        if (response.status !== 200 || response.data?.status !== 'SUCCESS') {
            throw new Error('LocalResearchAgent: Gateway returned non-success: ' + JSON.stringify(response.data));
        }

        return {
            agent_id: this.agentId,
            mission_id,
            execution_attempt_id,
            model: response.data.model,
            result_text: response.data.text,
            usage: response.data.usage,
            timing: response.data.timing,
            finish_reason: response.data.finish_reason
        };
    }
}
