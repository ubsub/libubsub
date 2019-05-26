const axios = require('axios');
const _ = require('lodash');
const config = require('./config');

/**
 * @param  {string} userId - the user or token id
 * @param  {string} userKey - the user key or token key
 * @param  {object} options - {routerHost}, override default router
 * @return {object} The API client object
 */
module.exports = (userId, userKey, { routerHost = config.ROUTER_URL }) => {
  function executeRequest(method, path, data, params) {
    return axios({
      url: `${routerHost}/api/v1/user/${userId}${path}`,
      method,
      data,
      params,
      headers: {
        Authorization: `Bearer ${userKey}`,
      },
    }).then(payload => payload.data);
  }

  return {
    /**
     * @return {string} The base URL to the router
     */
    routerUrl() {
      return routerHost;
    },

    /**
     * @return {string} The userId/tokenId the API is currently using
     */
    tokenId() {
      return userId;
    },

    /**
     * @return {object} user object for current token/user id
     */
    getUser() {
      return executeRequest('GET', '');
    },

    /**
     * Retrieves the topic for the given id
     * @param  {string} id - Topic id
     * @return {object} topic object
     */
    getTopicById(id) {
      return executeRequest('GET', `/topic/${id}`);
    },

    /**
     * Get all topic objects
     * @return {array} List of all topic objects
     */
    getTopics() {
      return executeRequest('GET', '/topic');
    },

    /**
     * Retrieve a topic by looking for its id first, and fail that, comparing to its name
     * @param  {string} idOrName - Topic id or name
     * @return {object} topic - Single topic
     */
    getTopicByIdOrName(idOrName) {
      return this.getTopicById(idOrName)
        .catch(() => this.getTopics()
          .then((topics) => {
            const topic = _.find(topics, x => x.name === idOrName);
            if (!topic) throw new Error(`No topic found with id or name of '${idOrName}'`);
            return topic;
          }));
    },

    /**
     * Get all templates associated with the user
     * @return {object} Template
     */
    getTemplates() {
      return executeRequest('GET', '/template');
    },

    /**
     * Create a new topic. Will fail on name collision
     * @param  {string} name - Name of the topic to create
     * @param  {Boolean/string} key - True if want key, false if not key, or string for specific key
     * @return {object} Topic
     */
    createTopic(name, key = true) {
      return executeRequest('POST', '/topic', {
        name,
        key,
      });
    },

    /**
     * Delete a topic
     * @param  {string} id - Delete topic by id
     * @return {object} Deletion object
     */
    deleteTopic(id) {
      return executeRequest('DELETE', `/topic/${id}`);
    },

    /**
     * Retrieve template object with id
     * @param  {string} id - Id of template
     * @return {object} Template
     */
    getTemplate(id) {
      if (!id) return Promise.reject(Error('No such template'));
      return executeRequest('GET', `/template/${id}`);
    },

    /**
     * Create a new template
     * @param  {string} name - Name of the template
     * @param  {string} language - Language of template. See /docs/languages for valid types
     * @param  {string} source - Source of template
     * @return {object} The template object
     */
    createTemplate(name, language, source) {
      return executeRequest('POST', '/template', {
        name,
        language,
        source,
      });
    },

    /**
     * Update information on template
     * @param  {string} id - Id of template to update
     * @param  {object} {name, language, source} - Optional pieces to update for template
     * @return {[type]} template
     */
    updateTemplate(id, { name, language, source }) {
      if (!id) return Promise.reject(Error('No such template'));
      return executeRequest('PATCH', `/template/${id}`, {
        name,
        language,
        source,
      });
    },

    /* eslint object-curly-newline: off */
    /**
     * Helper method to update a template, or create if it doesn't exist
     * @param  {object} {id, name, language, source}
     * @return {object} template
     */
    createOrUpdateTemplate({ id, name, language, source }) {
      return this.updateTemplate(id, { name, language, source })
        .catch(() => this.createTemplate(name, language, source));
    },

    /**
     * @return {array} Returns list of all tokens present
     */
    getTokens() {
      return executeRequest('GET', '/token');
    },

    /**
     * Create a new token
     * @param  {string} name - Name of token to create
     * @param  {string} scope - Scope of token
     * @param  {string} clientId - ClientId the token can be used for
     * @return {object} The token
     */
    createToken(name, scope, clientId = undefined) {
      return executeRequest('POST', '/token', { name, scope, client_id: clientId });
    },

    /**
     * Get events given search options
     * @param  {object} searchOpts - Search options
     * @return {array} events
     */
    getEvents(searchOpts) {
      return executeRequest('GET', '/events', null, searchOpts);
    },
  };
};
