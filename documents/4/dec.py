def basic_auth(get_json):
    def wrapper():
        print('Test login here')
        get_json()
        print('logged in and function executed')
    return wrapper

@basic_auth()
def func_sample():
    print('smaple data')

func_sample()
    
