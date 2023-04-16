from flask import Flask, render_template, request, send_file
import mimetypes, os, uuid, time
from PIL import Image
import PIL.ImageOps

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
app = Flask(__name__)


def model_process(filename):
    # TODO: Change it to make YOLO output
    time.sleep(3)
    image = Image.open("static/images/{}".format(filename))
    output_img = format(uuid.uuid4()) + ".png"
    if image.mode == 'RGBA':
        r, g, b, a = image.split()
        rgb_image = Image.merge('RGB', (r, g, b))
        inverted_image = PIL.ImageOps.invert(rgb_image)
        r2, g2, b2 = inverted_image.split()
        final_transparent_image = Image.merge('RGBA', (r2, g2, b2, a))
        final_transparent_image.save('static/images/{}'.format(output_img))

    else:
        inverted_image = PIL.ImageOps.invert(image)
        inverted_image.save('static/images/{}'.format(output_img))

    return_obj = {
        "img_name" : "output_img/{}".format(output_img),

        "log_info" : {
            "a" : "BB",
            "b" : 123
        }
    }
    return return_obj




@app.route('/')
def render_html():
    return render_template('index.html')

@app.route('/imgUpload', methods=['post'])
def img_process():
    files = request.files
    file = files.get('file').read()
    image_name= format(uuid.uuid4()) + '.png'
    with open(os.path.abspath(f'static/images/{image_name}'), 'wb') as f:
        f.write(file)
    return_obj = model_process(image_name)

    return return_obj

@app.route('/output_img/<path:path>')
def return_img(path):
    return app.send_static_file("images/{}".format(path))

if __name__ == '__main__':
    app.run()


