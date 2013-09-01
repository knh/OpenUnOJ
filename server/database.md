数据库结构

un_user
	ID uid
	TEXT username
	TEXT password (hashed & salted)
	TEXT email
	DATE register
	TEXT signature
	TEXT blog
	
un_user_meta
	ID uid
	TEXT meta_key
	TEXT meta_value
	
un_problem
	ID pid
	TEXT title
	TEXT description
	TEXT 
	
un_problem_meta


un_contest

un_submission
