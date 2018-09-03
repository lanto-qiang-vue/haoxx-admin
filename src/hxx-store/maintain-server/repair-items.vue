<template>
<div>
<Tree :data="data2" show-checkbox></Tree>
</div>
</template>
<script>
export default{
	name:'repair-items',
          data () {
            return {
                data2: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>