
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// console.log(this.$u.config.v);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:function() {  

		},  
	}
</script>

<style lang="scss">
	// @import "uview-ui/index.scss";
	@import './common/common.css';

	page,
	view {
		display: flex;
	}

	page {
		display: flex;
		min-height: 100%;
		background-color: #EFEFEF;
	}

	template {
		display: flex;
		flex: 1;
	}
</style>
