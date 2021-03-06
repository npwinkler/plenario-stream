var endpoint = 'test-cluster.bkhf8w.0001.usw2.cache.amazonaws.com',
    redis = require('redis'),
    materialize = require('../summarizer/materialize');
    promise = require('promise');

var update_node = function (observations,metadata) {
	var client = redis.createClient(6379, endpoint);
	client.get(metadata['id'], function(err, value) {
		if(value != null){
			client.set(metadata['id'],JSON.stringify(materialize.update_node_summary(JSON.parse(value),observations,metadata)),function(err, reply){
				client.quit();
			});
		}
		else{
			client.set(metadata['id'],JSON.stringify(materialize.make_node_summary(observations,metadata)),function(err, reply){
				client.quit();
                        });
		}
	});
};

var pull_node = function(id) {
	var client = redis.createClient(6379, endpoint);
	var prom = new promise(function(resolve, reject) {
		client.get(id, function(err, value) {
			client.quit();
			if(value != null){
                        	resolve(value);
			}
			else {
				reject('No data found for that node ID');
			}
		});
	});

	return prom.then(function(res) {
		return res;
	},function(err){
		return err;	
	});
};

exports.update_node = update_node;
exports.pull_node = pull_node;
