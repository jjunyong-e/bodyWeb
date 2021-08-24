import os
import glob

path = "./model/obj"
files = glob.glob(path + '/*')

for f in files:
  new_f = f.replace('_', '')   # 문자 삭제
  os.rename(f, new_f)
  print('{} ==> {}'.format(f, new_f))