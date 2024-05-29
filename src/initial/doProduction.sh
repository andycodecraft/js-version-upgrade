#!/usr/bin/env bash

vA1="$1"
vA2="$2"
vA3="$1"

if [ -z "$vA1" ]; then
	PS3="Please select an option: "
	options=("test" "development" "production")
	select opt in "${options[@]}"; do
		case $opt in
		"development" | "staging")
			vA1="development"
			break
			;;
		"test")
			vA1="test"
			break
			;;
		"production")
			vA1="production"
			break
			;;
		*) echo "Invalid option. Please choose 1-4." ;;
		esac
	done
fi

if [ -z "$vA2" ]; then
	PS3="Please select an option: "
	options=("motocal" "vorova" "racenumbers" "all")
	select opt in "${options[@]}"; do
		case $opt in
		"motocal")
			vA2="motocal"
			break
			;;
		"vorova")
			vA2="vorova"
			break
			;;
		"racenumbers")
			vA2="racenumbers"
			break
			;;
		"all")
			vA2="all"
			break
			;;
		*) echo "Invalid option. Please choose 1-4." ;;
		esac
	done
fi

# Set gs bucket based on first argument
if [ "$vA1" == "development" ] || [ "$vA1" == "staging" ]; then
	vA3="production"
	gs_bucket="public-$vA2-staging-ui"
elif [ "$vA1" == "test" ]; then
	gs_bucket="public-$vA2-testing-ui"
elif [ "$vA1" == "production" ]; then
	gs_bucket="public-$vA2-app-ui"
else
	echo "Invalid first argument. Please choose 'test | development | production'."
	exit 1
fi

run_doIT() {
	if [ "$vA1" != "test" ]; then
		./updateVersionNumbers.sh
	fi

	# Build Ember project in specified environment mode
	ember build --environment $vA3

	# Navigate to the dist/ directory
	cd dist/
}

run_vorova() {
	echo "Running 'vorova $vA1'..."
	# Update files on Vorova project
	gcloud config set project vorova-2017
	gsutil -h "Cache-Control: no-store" cp -R assets/ gs://$gs_bucket/app/
	gsutil -h "Cache-Control: no-store" cp index.html gs://$gs_bucket/app/

	#public-vorova-uniqkea-ui
	#public-vorova-demo-ui

	# Update files on production project if production is selected
	if [ "$vA1" == "production" ]; then
		gsutil -h "Cache-Control: no-store" cp -R assets/ gs://public-$vA2-staging-ui/app/
		gsutil -h "Cache-Control: no-store" cp index.html gs://public-$vA2-staging-ui/app/
	fi

}

run_racenumbers() {
	echo "Running 'racenumbers'..."
	# Update files on racenumbers project
	gcloud config set project motocal-160910
	gsutil -h "Cache-Control: no-store" cp -R assets/ gs://$gs_bucket/app/
	gsutil -h "Cache-Control: no-store" cp index.html gs://$gs_bucket/app/
}

run_motocal() {
	echo "Running 'motocal $vA1'..."
	# Update files on Motocal project
	gcloud config set project motocal-160910
	gsutil -h "Cache-Control: no-store" cp -R assets/ gs://$gs_bucket/app/
	gsutil -h "Cache-Control: no-store" cp index.html gs://$gs_bucket/app/

	# Update files on production project if production is selected
	if [ "$vA1" == "production" ]; then
		gsutil -h "Cache-Control: no-store" cp -R assets/ gs://public-$vA2-production-ui/app/
		gsutil -h "Cache-Control: no-store" cp index.html gs://public-$vA2-production-ui/app/
		gsutil -h "Cache-Control: no-store" cp -R assets/ gs://public-$vA2-staging-ui/app/
		gsutil -h "Cache-Control: no-store" cp index.html gs://public-$vA2-staging-ui/app/
	fi
}

run_all() {
	echo "Running 'all'..."
	run_motocal
	run_vorova
	run_racenumbers
}

if [ "$vA1" != "test" ]; then
	if [ "$vA2" == "vorova" ]; then
		run_doIT
		run_vorova
	elif [ "$vA2" == "motocal" ]; then
		run_doIT
		run_motocal
	elif [ "$vA2" == "racenumbers" ] || [ "$vA1" != "development" ]; then
		run_doIT
		run_racenumbers
	elif [ "$vA2" == "all" ]; then
		run_doIT
		run_all
	else
		echo "Invalid second argument. Please choose 'vorova | motocal | racenumbers | all'."
		exit 1
	fi
else
	run_doIT
fi
