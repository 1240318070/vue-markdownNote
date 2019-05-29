Vue.filter('date', time => { return (time !== '') ? moment(time).format('YY/MM/DD, HH:mm') : ''});
new Vue({
    el: "#notebook",
    data: function () {
        return{
            content: localStorage.getItem('content') || '欢迎使用Markdown编辑器！',
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            index: Number(localStorage.getItem('index')),
            title: ''
        }
    },
    methods: {
        //存储笔记
        saveNote: function (val) {
            if (this.index !== -1){
                localStorage.setItem('content', val);
                this.notes[this.index].content = val;
            }
        },
        //增加笔记
        addNode: function () {
            const time = Date.now();
            const note = {
                id: String(time),
                title: 'new title' + (this.notes.length),
                content: 'welcome to use **Markdown**',
                created: time,
                favorite: false
            };
            this.notes.push(note);
            this.getNote(this.notes.length - 1);//添加笔记时，自动获取笔记内容
        },
        //存储所有的笔记
        saveNotes: function (notes) {
            localStorage.setItem('notes', JSON.stringify(notes))
        },
        //点击获取笔记内容
        getNote: function (index) {
            this.content = this.notes[index].content;
            this.index = index;
            this.alterNoteTitle(index);
        },
        //删除笔记
        deleteNote: function (index) {
            const oldh = this.notes.slice(0, index);
            const oldf = this.notes.slice(index + 1, this.notes.length);
            this.notes = oldh.concat(oldf);
            if (index === this.index){
                this.content = '';
                this.title = '';
                this.index = -1;
            }else if (index < this.index){
                this.index--;
            }
        },
        //重命名笔记
        alterNoteTitle: function (index) {
            this.title = this.notes[index].title;
        },
        //收藏笔记
        favoriteNote: function (index) {
            this.notes[index].favorite = !this.notes[index].favorite;
        },
        //index变化时存储index
        saveIndex: function (val) {
            localStorage.setItem('index', val);
        },
        //title变化时存储title
        saveTitle: function (val) {
            if (this.index !== -1){
                this.notes[this.index].title = val;
            }
        }
    },
    computed: {
        //更改笔记的时候，对Markdown界面进行同步
        notePreview: function () {
            return marked(this.content);
        },
        //将收藏的note排在前面
        sortNotes: function () {
            return this.notes
                .sort((a, b) => (a.created - b.created))
                .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1);
        },
        //渲染日期格式
        time: function (){
            return (this.index !== -1) ? this.notes[this.index].created : '';
        },
        //计算行数
        countLine: function () {
            return this.content.split(/\r\n|\r|\n/g).length;
        },
        //计算字符数
        countCharNum: function () {
            return this.content.replace(/\s/g ,'').length;
        }
    },
    watch: {
        content: {
            handler(val, oldVal){
                this.saveNote(val);
            }
        },
        notes: {
            handler(val, oldVal){
                this.saveNotes(val);
            },
            deep: true//值发生变化时立刻响应
        },
        index: function (val, oldVal) {
            this.saveIndex(val);
        },
        title: function (val, oidVal) {
            this.saveTitle(val);
        }
    },
    created: function () {
        if (this.index > -1)
            this.title = this.notes[this.index].title;
    }
});