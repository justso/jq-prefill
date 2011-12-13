/** VERSION =============================================================== *
 *  hrs3143:prefill.js  ^  david.turgeon @ wf  ^  2011-09-23 .. 2011-09-23
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/**
 * jqPrefill JQ mod
 * @inherits jqext
 *
 * Populate form fields with test values
 * base values on names using token value arrays
 * Works only on form elements
 *
 * TODO: Refinements
 *  -skip if not showing
 *  -provide new tokens via selector params
 *  -look at label text/html
 *  -look at css class names
 *
 * --- don't declare anything out here in the global namespace
 */
(function($){
    /**
     * @scope CLOSURE
     * Declarations here will be single instance
     * Good place for immutables or stateless functions
     */
    var fN = '$.prefill',
    keys = {
        city:  'city',
        date:  'date',
        email: 'email address mail cc',
        family:'family last name',
        first: 'first given name',
        full:  'full contact manager name name',
        bignum:'num salary amount num',
        lilnum:'num of amt days pct percent months num',
        nation:'country nation territory province',
        phone: 'phone contact tele fax number',
        state: 'state province',
        street:'street address',
        title: 'title',
        unit:  'unit apartment suite',
        zip:   'zip code postal',
        x:0,
        large: 'explain describe comment infor note',
        z:0
    },
    tokens = {
        city:  ['Johnsonville','Edina'],
        date:  ['12/12/2012', '01/01/2001'],
        email: ['david.turgeon@wellsfargo.com'],
        family:['Doe-Featherbun','Sampson'],
        first: ['Mary Jane', 'Sully'],
        full : ['Nancy Knox', 'Dallas Austin'],
        bignum:['$120,234.34','$34321'],
        lilnum:['1','2','3','4.5', 0],
        nation:['USA','China','France'],
        phone: ['1-123-123-1234', '(555) 123-1234', '321-1234'],
        state :['MN','Alaska'],
        street:['123 Maple Drive','321 Contact Blvd.'],
        title :['Senior Bigwig','Managing Supervisor'],
        zip   :['12345','54321-1234'],
        x:0,
        small: ['Mary had a little lamb', 'The quick brown fox...'],
        large: ['Mary had a little lamb, little lamb, little lamb. \
Mary had a little lamb! It’s fleece was white as snow!',
        'The quick, brown fox jumped over that lazy \
(that lazy, lazy, lazy!! lazy, lazy! lazy, lazy!! lazy, lazy! lazy!!) dog.'],
        z:0
    };
    splinter(keys);
    /**
     * Extend jquery wrapper functions
     * @param force {boolean} override inhibition to check widgets
     * Declarations here are created each invocation
     */
    $.fn['prefill'] = function(force) {
        var log = [];
        if (force === false)
            return this;
        this.each(function() {
            var me = $(this)
            ,   fo = me.prop('form')
            ,   id = me.prop('name')
            ,   tn = me.prop('tagName')
            ,   ty = me.prop('type')
            ;
            try {
                // no LABEL /or/ OPTION /or/ submit
                if (!fo || !ty || ty === 'submit') return null;
                me.addClass('prefill');
                if (force && (ty === 'radio' || ty === 'checkbox'))
                    return clickOne(me);
                if (tn === 'SELECT') return selectOne(me);

                if (!ty.match('text') && !ty.match('textarea')) return null;
                var match = tokens[ rateAll(id, keys) ];
                me.val(match ? pickOne(match) : '?');
            } catch(e) {
                clog(9, fN, e);
            } finally {
                if (fo) log.push(id || ''+this);
            }
        });
        if (log[0]) clog(fN, log);
        return this;
    };
    /**
     * Helper for pre-array strings to split in place
     * @param obj {object} with strings for props
     * @param on {string} or ' ' on which to split
     */
    function splinter (obj, on){
        if (!obj) return;
        on = on || ' ';
        var s, i;
        for (i in obj){
            s = obj[i];
            if (typeof s !== 'string') continue;
            obj[i] = s.split(on);
        }
    }
    /**
     * take string and key group and give back tallies
     */
    function rateAll(str, obj){
        var cnt, i, top = 0, best;
        for (i in obj) {
            cnt = rateOne(str, obj[i]);
            if (cnt > top) ((top = cnt) && (best = i));
        }
        return best;
    }
    /**
     * take string and keys and tally matches
     */
    function rateOne(str,keys){
        var cnt = 0, i, all;
        for (i=0; i < keys.length; i++){
            all = str.match( new RegExp(keys[i],'ig') );
            if (all && all.length) cnt += all.length;
        }
        return cnt;
    }
    /**
     * given a random number 0 to arg length
     */
    function pickOne(arr){
        var i = Math.floor(Math.random() * arr.length);
        return arr[i];
    }
    function clickOne(jq){
        jq = $.findObj(jq); // get group
        var i = Math.floor(Math.random() * jq.length);
        jq.formVal([i]);
    }
    function selectOne(jq){
        jq = jq.children();
        var i = Math.floor(Math.random() * jq.length);
        jq.eq(i?i:1).attr('selected', true);
    }
    // inits
    $(function(){
        if ($.jsPath){ // my ext
            $.loadCssFor('prefill');
        }
    });
})(jQuery);

// $(':input').not('input').get() /// non-input inputs
