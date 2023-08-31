import { MariaSQL, MSSQL, MySQL, PLSQL, PostgreSQL, sql, SQLDialect, StandardSQL } from '@codemirror/lang-sql'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'

const themesMap = { 'light': githubLight, 'dark': githubDark }

const SparkSQL = {
  name: 'SparkSQL',
  keywords:
    'add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with',
  builtin:
    'abs acos acosh add_months aggregate and any approx_count_distinct approx_percentile array array_contains array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_repeat array_sort array_union arrays_overlap arrays_zip ascii asin asinh assert_true atan atan2 atanh avg base64 between bigint bin binary bit_and bit_count bit_get bit_length bit_or bit_xor bool_and bool_or boolean bround btrim cardinality case cast cbrt ceil ceiling char char_length character_length chr coalesce collect_list collect_set concat concat_ws conv corr cos cosh cot count count_if count_min_sketch covar_pop covar_samp crc32 cume_dist current_catalog current_database current_date current_timestamp current_timezone current_user date date_add date_format date_from_unix_date date_part date_sub date_trunc datediff day dayofmonth dayofweek dayofyear decimal decode degrees delimited dense_rank div double e element_at elt encode every exists exp explode explode_outer expm1 extract factorial filter find_in_set first first_value flatten float floor forall format_number format_string from_csv from_json from_unixtime from_utc_timestamp get_json_object getbit greatest grouping grouping_id hash hex hour hypot if ifnull in initcap inline inline_outer input_file_block_length input_file_block_start input_file_name inputformat instr int isnan isnotnull isnull java_method json_array_length json_object_keys json_tuple kurtosis lag last last_day last_value lcase lead least left length levenshtein like ln locate log log10 log1p log2 lower lpad ltrim make_date make_dt_interval make_interval make_timestamp make_ym_interval map map_concat map_entries map_filter map_from_arrays map_from_entries map_keys map_values map_zip_with max max_by md5 mean min min_by minute mod monotonically_increasing_id month months_between named_struct nanvl negative next_day not now nth_value ntile nullif nvl nvl2 octet_length or outputformat overlay parse_url percent_rank percentile percentile_approx pi pmod posexplode posexplode_outer position positive pow power printf quarter radians raise_error rand randn random rank rcfile reflect regexp regexp_extract regexp_extract_all regexp_like regexp_replace repeat replace reverse right rint rlike round row_number rpad rtrim schema_of_csv schema_of_json second sentences sequence sequencefile serde session_window sha sha1 sha2 shiftleft shiftright shiftrightunsigned shuffle sign signum sin sinh size skewness slice smallint some sort_array soundex space spark_partition_id split sqrt stack std stddev stddev_pop stddev_samp str_to_map string struct substr substring substring_index sum tan tanh textfile timestamp timestamp_micros timestamp_millis timestamp_seconds tinyint to_csv to_date to_json to_timestamp to_unix_timestamp to_utc_timestamp transform transform_keys transform_values translate trim trunc try_add try_divide typeof ucase unbase64 unhex uniontype unix_date unix_micros unix_millis unix_seconds unix_timestamp upper uuid var_pop var_samp variance version weekday weekofyear when width_bucket window xpath xpath_boolean xpath_double xpath_float xpath_int xpath_long xpath_number xpath_short xpath_string xxhash64 year zip_with',
  atoms: 'false true null',
  operatorChars: '*/+\\-%<>!=~&|^'
}
const ImpalaSQL = {
  name: 'ImpalaSQL',
  keywords:
    'add aggregate all allocate alter analytic and anti any api_version are array array_agg array_max_cardinalit as asc asensitive asymmetric at atomic authorization avro backup begin begin_frame begin_partition between bigint binary blob block_size boolean both break browse bulk by cache cached call called cardinality cascade cascaded change char character character_length check checkpoint class classifier clob close close_fn clustered collate collect column columns comment commit compression compute condition conf connect constraint contains continue convert copy corr corresponding covar_pop covar_samp create cross cube current current_catalog current_date current_default_tran current_path current_role current_row current_schema current_time current_transform_gr current_user cursor cycle data database databases date datetime dbcc deallocate dec decfloat decimal declare default define delete delimited deny deref desc describe deterministic disconnect disk distinct distributed div double drop dump dynamic each element else empty encoding end end-exec end_frame end_partition equals errlvl escape escaped every except exchange exec execute exists exit explain extended external false fetch fields file filefactor fileformat files filter finalize_fn first float following for foreign format formatted frame_row free freetext from full function functions fusion get global goto grant group grouping groups hash having hold holdlock identity ignore ilike import in incremental index indicator initial init_fn inner inout inpath insensitive insert int integer intermediate intersect intersection interval into invalidate iregexp is join json_array json_arrayagg json_exists json_object json_objectagg json_query json_table json_table_primitive json_value key kill kudu language large last lateral leading less like like_regex limit lineno lines listagg load local localtime localtimestamp location macro map match matches match_number match_recognize member merge merge_fn metadata method modifies module more multiset national natural nchar nclob new no nocheck nonclustered none normalize not nth_value null nulls numeric occurrences_regex octet_length of off offset offsets old omit on one only open option or order out outer overlaps overlay overwrite parameter parquet parquetfile partialscan partition partitioned partitions pattern per percent percentile_cont percentile_disc period pivot plan portion position position_regex precedes preceding prepare prepare_fn preserve primary print proc procedure produced ptf public purge raiseerror range rcfile read reads readtext real reconfigure recover recursive reduce ref references referencing refresh regexp regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy release rename repeatable replication restore restrict result return returns revert revoke rlike role roles rollback rollup row rowcount rows rule running save savepoint schema schemas scope scroll search securityaudit seek select semi sensitive sequencefile serdeproperties serialize_fn session_user set setuser show shutdown similar skip smallint some sort specific specifictype sql sqlexception sqlstate sqlwarning start static statistics stats stored straight_join string struct submultiset subset substring_regex succeeds symbol symmetric system system_time system_user table tables tablesample tblproperties terminated textfile textsize then time timestamp timezone_hour timezone_minute tinyint to top trailing tran transform translate_regex translation treat trigger trim_array true try_convert uescape unbounded uncached union unique uniquejoin unknown unnest unpivot update updatetext update_fn upsert use using utc_tmestamp value values value_of varbinary varchar varying versioning view views waitfor whenever where while window with within without writetext ',
  builtin:
    'adddate concat cot datediff day dayofyear fnv_hash get_json_object instr isnotfalse istrue least length ltrim max min_tinyint minute next_day percent_rank rotateright round shiftleft stddev subdate utc_timestamp weekofyear years_sub base64encode bitor when chr coalesce concat_ws countset date_sub decode factorial int_months_between jaro_similarity jaro_winker_distance jw_dst lag minutes_sub months_sub ndv nvl2 pid rank row_number strright to_utc_timestamp unhex upper atan bin bitnot case cosh date_trunc dayofweek days_sub dense_rank effective_user floor greatest jaro_dist jw_sim millisecond min min_int minutes_add month ntile pow fpow quarter regexp_escape replace right rpad seconds_add sinh substring uuid var_pop width_bucket acos bitxor conv count current_timestamp degrees exp dfloor from_timestamp hours_add jaro_sim ln log log10 milliseconds_add milliseconds_sub months_add nanoseconds_add now nullif pmod dpow regexp_like rotateleft second setbit sign sin sleep sqrt stddev_pop tan to_date to_timestamp translate variance weeks_sub add_months cos current_database date_part first_value group_concat if isfalse isnull jaro_winker_similarity last_value locate log2 max_smallint max_bigint microseconds_sub murmur_hash scale seconds_sub strleft user variance_pop years_add zeroifnull abs ascii asin avg base64decode cast ceiling date_add days_add extract fmod from_utc_timestamp getbit ifnull initcap isnottrue lead left lcase lpad max_int microseconds_add nanoseconds_sub nullifzero over parse_url precision quotient rtrim space split_part substr sum timeofday typeof unix_timestamp variance_samp appx_median bitand ceil dceil is_inf lower min_bigint monthname pi power random regexp_replace repeat reverse trunc dtrunc ucase var_samp version weeks_add atan2 btrim char_length cume_dist dayname e find_in_set from_unixtime hex hour hours_sub is_nan jaro_distance max_tinyint min_smallint mod months_between negative nonnullvalue nullvalue nvl positive radians rand regexp_extract dround shiftright stddev_samp tanh timestamp_cmp trim truncate year',
  atoms: 'false true null unknown',
  operatorChars: '*/+\\-%<>!=~&|^'
}
const HiveSQL = {
  name: 'HiveSQL',
  keywords: 'select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with admin authorization char compact compactions conf cube current current_date current_timestamp day decimal defined dependency directories elem_type exchange file following for grouping hour ignore inner interval jar less logical macro minute month more none noscan over owner partialscan preceding pretty principals protection reload rewrite role roles rollup rows second server sets skewed transactions truncate unbounded unset uri user values window year',
  builtin: 'bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype key_type utctimestamp value_type varchar',
  atoms: 'false true null unknown',
  operatorChars: '*+\\-%<>!='
}

const sqlDialectMap = {
  'mssql': MSSQL,
  'mariasql': MariaSQL,
  'mysql': MySQL,
  'postgresql': PostgreSQL,
  'sparksql': SQLDialect.define(SparkSQL),
  'hivesql': SQLDialect.define(HiveSQL),
  'impalasql': SQLDialect.define(ImpalaSQL),
  'plsql': PLSQL
}

function getSqlDialect(langType) {
  let lang = sqlDialectMap[langType]
  if (!lang) {
    lang = StandardSQL
  }
  return lang
}

/**
 * 获取language
 *
 * @param langType mssql/mysql ...
 * @param schema { 'schema.table': [字段1，字段2], 'schema.table2': [] }
 * @param defaultSchema 默认的数据库schema，可以显示该schema的表名
 * @param defaultTable 默认的数据库表，可以显示该表的字段信息
 * @returns {LanguageSupport}
 */
function getLanguage(langType, schema, defaultSchema, defaultTable) {
  const sqlDialect = getSqlDialect(langType)
  const _language = sql({
    dialect: sqlDialect,
    schema: schema,
    defaultSchema: defaultSchema,
    defaultTable: defaultTable
  })
  return _language
}

export { getLanguage, themesMap, sqlDialectMap }