# This is a temporary script created by Chris.
# If you don't know what it does, it means you can safely delete it.
# It's a helper script, and is in no way connected to SSANTO

import argparse
import pickle

parser = argparse.ArgumentParser(description="Displays the content of a pickle file")
parser.add_argument("filename", metavar="file", type=str, help="the pickle file")

args = parser.parse_args()
with open(args.filename, "rb") as f:
    print(pickle.load(f))
