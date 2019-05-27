#!/usr/bin/env node
const io = require('socket.io-client');
const axios = require('axios');
const _ = require('lodash');
const Client = require('./api');
const config = require('./config');

/* eslint no-console: off */

/**
 * Create a new streaming client for a given user or token
 * @param  {string} userId - User or token ID
 * @param  {string} userKey - User or token key
 * @param  {object} ubsubOpts - Optional arguments to override streaming defaults { socketHost, routerHost, reconnectOnError, reconnectOnErrorDelay }
 * @return {object} functions to be used with the given config
 */
module.exports = (userId, userKey, ubsubOpts = undefined) => {
  const opts = _.assign({
    socketHost: config.SOCKET_URL,
    routerHost: config.ROUTER_URL,
    reconnectOnError: true,
    reconnectOnErrorDelay: 5000,
  }, ubsubOpts);

  return {
    /**
     * Listen to a given topic and pipe events through a callback
     * @param  {string} topicId - the ID of the topic to listen to
     * @param  {function} onEvent - Function callback when event received (payload, metadata)
     * @return {object} the SocketIO socket
     */
    listen(topicId, onEvent) {
      const sock = io(`${opts.socketHost}/socket?userId=${userId}&topicId=${topicId}&userKey=${userKey}`);
      sock.on('event', (event) => {
        onEvent(event.payload, _.omit(event, 'payload'));
      });
      sock.on('connect', () => {
        console.error(`Connected to ${topicId}`);
      });
      sock.on('handshake-error', (err) => {
        console.error(`Failed to listen to topic ${topicId}: ${err.err}`);
      });
      sock.on('reconnect', () => {
        console.error(`Reconnected topic ${topicId}`);
      });
      sock.on('disconnect', () => {
        console.error(`Disconnected topic ${topicId}`);
        if (opts.reconnectOnError) {
          console.error(`Attempting reconnect to ${topicId}...`);
          setTimeout(() => sock.connect(), opts.reconnectOnErrorDelay);
        }
      });
      return sock;
    },

    /**
     * Provide a function to quickly pipe events into an ubsub topic
     * @param  {string} topicId - the topicId to post to
     * @param  {string} topicKey - Optional topic key
     * @return {function} Returns a function that can be called with an object and posted to an ubsub socket
     */
    pipe(topicId, topicKey = null) {
      const sock = io(`${opts.socketHost}/socket?userId=${userId}&userKey=${userKey}`);
      function cb(payload) {
        sock.emit('event', {
          topicId,
          topicKey,
          payload,
        });
      }
      cb.sock = sock;
      return cb;
    },

    /**
     * Create a forwarding-stream that moves events from a socket to a HTTP endpoint
     * @param  {string} topicId - ID of the topic to listen to
     * @param  {string} forwardUrl - HTTP url to forward events to
     * @param  {object} httpOpts - Optional additional httpOpts to send axios
     * @return {object} The socket used to listen
     */
    forward(topicId, forwardUrl, httpOpts = undefined) {
      return this.listen(topicId, (event) => {
        axios(_.merge({
          url: forwardUrl,
          data: event.payload,
          headers: {
            'X-Topic-Id': event.topicId,
          },
          method: 'post', // default, can be overriden in opts
        }, httpOpts)).catch((err) => {
          console.error(`Error forwarding event from '${topicId} to URL ${forwardUrl}: ${err.message}`);
        });
      });
    },

    /**
     * Send an event to a topic
     * @param  {string} topicId - Topic to send to
     * @param  {string} key - Topic key to authenticate against
     * @param  {object} data - Data to send to the topic
     * @param  {String} [method="POST"] What method to send to the topic with
     * @return {promise} Axios promise
     */
    send(topicId, key, data, method = 'POST') {
      return axios({
        url: `${opts.routerHost}/event/${topicId}`,
        method,
        data,
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
    },

    /**
     * Gets a new API client based on the current user id and key
     * @deprecated Please use API client directly
     * @return {Client} API Client
     */
    getApi() {
      return Client(userId, userKey, opts);
    },
  };
};
